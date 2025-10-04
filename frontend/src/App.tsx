// src/App.tsx
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import HomeView from "@/components/HomeView";
import NoteForm from "@/components/NoteForm";
import NotesList from "@/components/NotesList";
import NoteDetail from "@/components/NoteDetail";
import { api } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { Patient, Note, ViewType } from "@/types";

function App() {
  const [view, setView] = useState<ViewType>("home");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
    console.log("d");
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [patientsData, notesData] = await Promise.all([
        api.getPatients(),
        api.getNotes(),
      ]);

      setPatients(patientsData);
      setNotes(notesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(
        "Failed to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectNote = async (noteId: string) => {
    try {
      const note = await api.getNoteById(noteId);
      setSelectedNote(note);
      setView("detail");
    } catch (err) {
      console.error("Failed to fetch note:", err);
      setError("Failed to load note details");
    }
  };

  const handleNoteCreated = () => {
    // Refresh notes list
    fetchInitialData();
  };

  const handleNavigate = (newView: ViewType) => {
    setView(newView);
    setError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600 text-lg">Loading OASIS AI Scribe...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout onNavigate={handleNavigate}>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {view === "home" && (
        <HomeView
          patients={patients}
          notes={notes}
          onNavigate={handleNavigate}
        />
      )}

      {view === "create" && (
        <NoteForm
          patients={patients}
          onNavigate={handleNavigate}
          onNoteCreated={handleNoteCreated}
        />
      )}

      {view === "notes" && (
        <NotesList
          notes={notes}
          onNavigate={handleNavigate}
          onSelectNote={handleSelectNote}
        />
      )}

      {view === "detail" && selectedNote && (
        <NoteDetail
          note={selectedNote}
          patient={patients.find((p) => p.mrn === selectedNote.patientMRN)}
          onNavigate={handleNavigate}
        />
      )}
    </Layout>
  );
}

export default App;
