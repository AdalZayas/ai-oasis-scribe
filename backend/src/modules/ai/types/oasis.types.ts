export interface OasisData {
  M1800: number; // Grooming
  M1810: number; // Dress Upper Body
  M1820: number; // Dress Lower Body
  M1830: number; // Bathing
  M1840: number; // Toilet Transferring
  M1845: number; // Toileting Hygiene
  M1850: number; // Transferring
  M1860: number; // Ambulation/Locomotion
}

export interface OasisExtractionResult {
  oasisData: OasisData;
  confidence: string;
  notes: string;
}

export interface TranscriptionResult {
  transcription: string;
  summary: string;
}
