// src/components/NotesList.tsx
import {
  User,
  Calendar,
  FileText,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, truncateText } from "@/lib/utils";
import type { Note, ViewType } from "@/types";

interface NotesListProps {
  notes: Note[];
  onNavigate: (view: ViewType) => void;
  onSelectNote: (noteId: string) => void;
}

export default function NotesList({
  notes,
  onNavigate,
  onSelectNote,
}: NotesListProps) {
  return (
    <div className="max-w-5xl mx-auto">
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Patient Notes</CardTitle>
              <CardDescription className="text-base mt-2">
                View and manage all OASIS assessment notes
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {notes.length} {notes.length === 1 ? "Note" : "Notes"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No notes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first patient assessment note to get started
              </p>
              <Button onClick={() => onNavigate("create")}>
                Create First Note
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className="cursor-pointer hover:shadow-md hover:border-blue-500 transition-all"
                  onClick={() => onSelectNote(note.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Patient Name */}
                        <div className="flex items-center mb-2">
                          <User className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-semibold text-lg text-gray-900">
                            {note.patientName}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDateTime(note.created_at)}
                        </div>

                        {/* Preview */}
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {note.summary
                            ? truncateText(note.summary, 150)
                            : truncateText(note.transcription, 150)}
                        </p>

                        {/* OASIS Badge */}
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            OASIS Section G Completed
                          </Badge>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
