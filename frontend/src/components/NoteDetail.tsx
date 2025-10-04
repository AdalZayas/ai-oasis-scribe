// src/components/NoteDetail.tsx
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  ClipboardList,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Note, Patient, ViewType } from "@/types";

interface NoteDetailProps {
  note: Note;
  patient: Patient | undefined;
  onNavigate: (view: ViewType) => void;
}

const OASIS_LABELS: Record<string, string> = {
  M1800: "M1800 - Grooming",
  M1810: "M1810 - Current Ability to Dress Upper Body",
  M1820: "M1820 - Current Ability to Dress Lower Body",
  M1830: "M1830 - Bathing",
  M1840: "M1840 - Toilet Transferring",
  M1845: "M1845 - Toileting Hygiene",
  M1850: "M1850 - Transferring",
  M1860: "M1860 - Ambulation/Locomotion",
};

export default function NoteDetail({
  note,
  patient,
  onNavigate,
}: NoteDetailProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => onNavigate("notes")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Notes
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                <CardTitle>Audio Transcription</CardTitle>
              </div>
              <CardDescription>
                Complete transcription of the patient assessment recording
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {note.transcription}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {note.summary && (
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2 text-green-600" />
                  <CardTitle>Assessment Summary</CardTitle>
                </div>
                <CardDescription>
                  AI-generated summary of the patient encounter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{note.summary}</p>
              </CardContent>
            </Card>
          )}

          {/* OASIS Section G */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2 text-purple-600" />
                    <CardTitle>OASIS Section G: Functional Status</CardTitle>
                  </div>
                  <CardDescription className="mt-2">
                    AI-extracted functional assessment data
                  </CardDescription>
                </div>
                <Badge variant="secondary">7 Items</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {note.oasisData &&
                  Object.entries(note.oasisData).map(([key, value], index) => (
                    <div key={key}>
                      <div className="flex items-start justify-between py-3">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">
                            {OASIS_LABELS[key] || key}
                          </div>
                          <div className="text-gray-700 bg-gray-50 p-3 rounded-md">
                            {value}
                          </div>
                        </div>
                      </div>
                      {index < Object.entries(note.oasisData).length - 1 && (
                        <Separator />
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Patient Info - 1 column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                <CardTitle>Patient Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {patient ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {`${patient.firstName} ${patient.lastName}`}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Date of Birth
                    </p>
                    <p className="text-base text-gray-900">
                      {formatDate(patient.dob)}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Medical Record Number
                    </p>
                    <p className="text-base font-mono text-gray-900">
                      {patient.mrn}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Note Created
                    </p>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-4 h-4 mr-2" />
                      <p className="text-base">
                        {formatDateTime(note.created_at)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Note ID
                    </p>
                    <p className="text-xs font-mono text-gray-500 break-all">
                      {note.id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  Patient information not available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
