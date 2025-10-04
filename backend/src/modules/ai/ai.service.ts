import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import { OasisExtractionResult } from './types/oasis.types';
import axios, { AxiosResponse } from 'axios';
import { OASIS_EXTRACTION_PROMPT, SUMMARY_PROMPT } from './prompts/oasis-extraction.prompt';
import * as fs from 'fs';
import FormData from 'form-data';

@Injectable()
export class AiService {
  private ollama: Ollama;
  private whisperBaseUrl: string;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    const ollamaUrl = this.configService.get<string>('OLLAMA_BASE_URL') || 'http://localhost:11434';
    this.whisperBaseUrl = this.configService.get<string>('WHISPER_BASE_URL') || 'http://localhost:9010';

    this.ollama = new Ollama({
      host: ollamaUrl,
    });

    this.logger.log(`Ollama configured at: ${ollamaUrl}`);
    this.logger.log(`Whisper configured at: ${this.whisperBaseUrl}`);
  }

  /**
   * Transcribe audio file using Whisper
   */
  async transcribeAudio(audioPath: string): Promise<string | undefined> {
    try {
      this.logger.log(`Transcribing audio with Whisper: ${audioPath}`);
      const formData = new FormData();
      formData.append('audio_file', fs.createReadStream(audioPath));

      const params = {
        encode: 'true',
        task: 'transcribe',
        language: 'en',
        output: 'txt',
      };

      try {
        const response: AxiosResponse<string> = await axios.post(`${this.whisperBaseUrl}/asr`, formData, {
          params,
          headers: formData.getHeaders(),
          maxBodyLength: Infinity,
        });
        this.logger.log('Transcription completed');
        return typeof response.data === 'string' ? response.data.trim() : response.data;
      } catch (err: any) {
        if (err instanceof Error) {
          throw new Error(`Whisper API error: ${err} - ${JSON.stringify(err)}`);
        }
        throw err;
      }
    } catch (error) {
      this.logger.error('Error transcribing audio:', error);
      if (error instanceof Error) {
        throw new Error(`Error in transcription: ${error.message}`);
      }
    }
  }

  /**
   * Generate summary using Ollama Llama 3.1
   */
  async generateSummary(transcription: string): Promise<string | undefined> {
    try {
      this.logger.log('Generating summary with Ollama...');

      const response = await this.ollama.chat({
        model: 'llama3.1',
        messages: [
          {
            role: 'system',
            content: 'You are a medical assistant specialized in clinical documentation.',
          },
          {
            role: 'user',
            content: `${SUMMARY_PROMPT}\n\n${transcription}`,
          },
        ],
        options: {
          temperature: 0.3,
          num_predict: 500,
        },
      });

      const summary = response.message.content.trim();
      this.logger.log('Summary generated');
      return summary;
    } catch (error) {
      this.logger.error('Error generating summary:', error);
      if (error instanceof Error) {
        throw new Error(`Error generating summary: ${error.message}`);
      }
    }
  }

  /**
   * Extract OASIS data using Ollama Llama 3.1
   */
  async extractOasisData(transcription: string): Promise<OasisExtractionResult | undefined> {
    try {
      this.logger.log('Extracting OASIS data with Ollama...');

      const response = await this.ollama.chat({
        model: 'llama3.1',
        messages: [
          {
            role: 'system',
            content:
              'You are a specialist in OASIS assessments for Home Health Care. You respond ONLY with valid JSON, no additional text.',
          },
          {
            role: 'user',
            content: `${OASIS_EXTRACTION_PROMPT}\n\n${transcription}`,
          },
        ],
        format: 'json', // Force JSON response
        options: {
          temperature: 0.1,
          num_predict: 1000,
        },
      });

      let responseText = response.message.content.trim();

      // Clean possible text before/after JSON
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');

      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.substring(jsonStart, jsonEnd + 1);
      }

      const result = JSON.parse(responseText) as {
        M1800: number;
        M1810: number;
        M1820: number;
        M1830: number;
        M1840: number;
        M1845: number;
        M1850: number;
        M1860: number;
        confidence: string;
        notes: string;
      };

      this.logger.log('OASIS data extracted', result);

      // Validate and assign default values
      const requiredFields = ['M1800', 'M1810', 'M1820', 'M1830', 'M1840', 'M1850', 'M1860'];

      for (const field of requiredFields) {
        if (result[field] === undefined || result[field] === null) {
          this.logger.warn(`Field ${field} missing, using default value 0`);
          result[field] = 0;
        }
      }

      return {
        oasisData: {
          M1800: result.M1800,
          M1810: result.M1810,
          M1820: result.M1820,
          M1830: result.M1830,
          M1840: result.M1840,
          M1845: result.M1845,
          M1850: result.M1850,
          M1860: result.M1860,
        },
        confidence: result.confidence || 'medium',
        notes: result.notes || 'Assessment generated automatically',
      };
    } catch (error) {
      this.logger.error('Error extracting OASIS data:', error);
      if (error instanceof Error) {
        throw new Error(`Error extracting OASIS data: ${error.message}`);
      }
    }
  }

  /**
   * Process complete audio file: transcription + summary + OASIS
   * Main method to be used from NotesService
   */
  async processAudioFile(audioPath: string): Promise<{
    transcription: string;
    summary: string;
    oasisData: OasisExtractionResult;
  }> {
    try {
      this.logger.log('Starting complete audio processing...');

      // Step 1: Transcribe audio with Whisper
      const transcription = await this.transcribeAudio(audioPath);
      if (!transcription) {
        throw new Error('Transcription failed or is empty');
      }
      // Step 2: Generate summary and extract OASIS in parallel
      const [summary, oasisData] = await Promise.all([
        this.generateSummary(transcription),
        this.extractOasisData(transcription),
      ]);

      this.logger.log('Complete processing finished');

      return {
        transcription,
        summary: summary || '',
        oasisData: oasisData || {
          oasisData: {
            M1800: 0,
            M1810: 0,
            M1820: 0,
            M1830: 0,
            M1840: 0,
            M1845: 0,
            M1850: 0,
            M1860: 0,
          },
          confidence: 'low',
          notes: 'OASIS extraction failed, default values assigned',
        },
      };
    } catch (error) {
      this.logger.error('Error in complete processing:', error);
      throw error;
    }
  }

  /**
   * Health check for AI services
   */
  async healthCheck(): Promise<{
    whisper: boolean;
    ollama: boolean;
    models: string[];
  }> {
    const health = {
      whisper: false,
      ollama: false,
      models: [] as string[],
    };

    // Check Whisper
    try {
      const response = await fetch(`${this.whisperBaseUrl}/docs`);
      health.whisper = response.ok;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn('Whisper health check failed');
      }
    }

    // Check Ollama
    try {
      const models = await this.ollama.list();
      health.ollama = true;
      health.models = models.models.map((m) => m.name);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.warn('Ollama health check failed');
      }
    }

    return health;
  }
}
