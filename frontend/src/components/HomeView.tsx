// src/components/HomeView.tsx
import { Plus, FileText, Users, ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ViewType, Patient, Note } from "@/types";

interface HomeViewProps {
  patients: Patient[];
  notes: Note[];
  onNavigate: (view: ViewType) => void;
}

export default function HomeView({
  patients,
  notes,
  onNavigate,
}: HomeViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          OASIS AI Scribe
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Document patient encounters quickly and compliantly with AI-powered
          transcription and OASIS form generation
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500 border-2"
          onClick={() => onNavigate("create")}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Create New Note</CardTitle>
            <CardDescription className="text-base">
              Record a patient assessment with audio upload
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:border-green-500 border-2"
          onClick={() => onNavigate("notes")}
        >
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">View Notes</CardTitle>
            <CardDescription className="text-base">
              Browse all patient notes ({notes.length})
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Stats Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-gray-600 font-medium">Total Patients</p>
              </div>
              <p className="text-4xl font-bold text-blue-600">
                {patients.length}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-gray-600 font-medium">Total Notes</p>
              </div>
              <p className="text-4xl font-bold text-green-600">
                {notes.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {notes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest patient notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onNavigate("notes")}
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {note.patientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
