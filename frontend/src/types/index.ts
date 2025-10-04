export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  createdAt: string;
  notesCount: number;
}

export interface OasisData {
  M1800: string;
  M1810: string;
  M1820: string;
  M1830: string;
  M1840: string;
  M1850: string;
  M1860: string;
  confidence: "high" | "medium" | "low";
  notes: string;
}

export interface Note {
  id: string;
  patientMRN: string;
  patientName: string;
  created_at: string;
  transcription: string;
  summary: string;
  oasisData: OasisData;
  createdAt: string;
}

export type ViewType = "home" | "create" | "notes" | "detail";
