import type { Note, Patient } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const api = {
  // TODO: Add GET patient by MRN
  // TODO: Add GET notes by patient MRN

  async getPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) throw new Error("Failed to fetch patients");
    return response.json();
  },

  async getNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json();
  },

  async getNoteById(id: string): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/find`);
    if (!response.ok) throw new Error("Failed to fetch note");
    return response.json();
  },

  async createNote(patientId: string, audioFile: File): Promise<Note> {
    const formData = new FormData();
    formData.append("patientMRN", patientId);
    formData.append("audio", audioFile);

    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to create note");
    return response.json();
  },
};
