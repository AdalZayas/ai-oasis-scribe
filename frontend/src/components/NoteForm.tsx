// src/components/NoteForm.tsx
import { useState } from "react";
import { Upload, FileAudio, ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Patient, ViewType } from "@/types";
import { toast, Toaster } from "sonner";

interface NoteFormProps {
  patients: Patient[];
  onNavigate: (view: ViewType) => void;
  onNoteCreated: () => void;
}

export default function NoteForm({
  patients,
  onNavigate,
  onNoteCreated,
}: NoteFormProps) {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("audio/")) {
        setError("Please upload an audio file");
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }

      setAudioFile(file);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatient || !audioFile) {
      setError("Please select a patient and upload an audio file");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      await api.createNote(selectedPatient, audioFile);

      // Reset form
      setSelectedPatient("");
      setAudioFile(null);

      // Notify parent and navigate
      onNoteCreated();
      onNavigate("notes");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to process audio. Please try again."
      );
      toast("Failed to create note. Please try again.", {
        icon: "❌",
        duration: 8000,
        action: {
          label: "Close",
          onClick: () => toast.dismiss(),
        },
        richColors: true,
        style: { backgroundColor: "#fee2e2", color: "#b91c1c" },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const selectedPatientData = patients.find((p) => p.id === selectedPatient);

  return (
    <div className=" mx-auto">
      <Toaster position="top-right" richColors />
      <Button
        variant="ghost"
        onClick={() => onNavigate("home")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create New OASIS Note</CardTitle>
          <CardDescription>
            Upload an audio recording of a patient assessment to generate an
            OASIS Section G form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-2">
            <Label htmlFor="patient-select">Select Patient *</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="w-full" id="patient-select">
                <SelectValue placeholder="Choose a patient..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.mrn} value={patient.mrn}>
                    {`${patient.firstName} ${patient.lastName}`} - DOB:{" "}
                    {formatDate(patient.dob)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Patient Info */}
          {selectedPatientData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-bold text-md">
                      Patient Name
                    </p>
                    <p className="text-gray-900">{`${selectedPatientData.firstName} ${selectedPatientData.lastName}`}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-bold text-md">
                      Date of Birth
                    </p>
                    <p className="text-gray-900">
                      {formatDate(selectedPatientData.dob)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-bold text-md">MRN</p>
                    <p className="text-gray-900">{selectedPatientData.mrn}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Upload */}
          <div className="space-y-2">
            <Label>Upload Audio File *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
                disabled={isUploading}
              />
              <label htmlFor="audio-upload" className="cursor-pointer block">
                {audioFile ? (
                  <div className="flex flex-col items-center text-green-600">
                    <FileAudio className="w-12 h-12 mb-3" />
                    <span className="font-medium text-lg">
                      {audioFile.name}
                    </span>
                    <span className="text-sm text-gray-600 mt-1">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      type="button"
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-700 font-medium mb-1">
                      Click to upload audio file
                    </p>
                    <p className="text-sm text-gray-500">
                      MP3, WAV, M4A, or other audio formats
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Maximum file size: 50MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isUploading || !selectedPatient || !audioFile}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Audio...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Note
              </>
            )}
          </Button>

          {isUploading && (
            <Alert>
              <AlertDescription>
                Processing your audio file. This may take a minute...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
