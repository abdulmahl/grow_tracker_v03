"use client";

import {
  X,
  Database,
  Download,
  Server,
  HardDrive,
  CheckCircle2,
} from "lucide-react";

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycles: any[];
  userId: string;
}

export default function DatabaseModal({
  isOpen,
  onClose,
  cycles,
  userId,
}: DatabaseModalProps) {
  if (!isOpen) return null;

  const handleExportData = () => {
    const exportPayload = {
      user: userId,
      exportedAt: new Date().toISOString(),
      cyclesCount: cycles.length,
      cycles,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cannagrow-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Database & Cloud Sync</h3>
            <p className="text-xs text-slate-400">
              Firestore database connection details
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Connection Status Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center space-x-2">
                <Server className="w-4 h-4 text-sky-400" />
                <span>Database Engine:</span>
              </span>
              <span className="font-bold text-slate-200">Google Firestore</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-sky-400" />
                <span>Active Cycles Stored:</span>
              </span>
              <span className="font-bold text-slate-200">{cycles.length}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <span className="text-slate-400">Sync Status:</span>
              <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Connected</span>
              </span>
            </div>
          </div>

          {/* Backup Export Section */}
          <button
            onClick={handleExportData}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-slate-950 font-semibold rounded-lg transition flex items-center justify-center space-x-2 text-sm shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (.JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
