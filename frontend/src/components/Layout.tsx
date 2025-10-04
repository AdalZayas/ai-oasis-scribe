// src/components/Layout.tsx
import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewType } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: ViewType) => void;
}

export default function Layout({ children, onNavigate }: LayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onNavigate("home")}
            >
              <Home className="w-6 h-6 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-gray-900">
                OASIS AI Scribe
              </span>
            </div>

            <Button onClick={() => onNavigate("create")}>
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-16 py-8 flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          OASIS AI Scribe - Home Health Documentation System
        </div>
      </footer>
    </div>
  );
}
