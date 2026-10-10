"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import EcChart from "@/components/EcChart";

import {
  Trash2,
  ArrowLeft,
  Plus,
  Activity,
  Calendar,
  FlaskConical,
  Loader2,
  Droplets,
  Camera,
  Grid,
  Clock,
} from "lucide-react";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

interface LogEntry {
  id: string;
  timestamp: string;
  ec: number;
  ph: number;
  waterVolume?: number;
  notes?: string;
  photoUrl?: string;
}

interface CycleDetailProps {
  userId: string;
  cycle: {
    id: string;
    strainName: string;
    stage: "Seedling" | "Vegetative" | "Flowering" | "Harvested";
    medium: string;
    startDate: string;
    tentSize?: string;
    lightSpec?: string;
    environment?: "Indoor" | "Outdoor" | "Green House";
  };
  onBack: () => void;
  onUpdateCycleStage: (cycleId: string, newStage: string) => void;
}

// Helper to format date into YYYY-MM-DDTHH:mm for datetime-local input
const getCurrentLocalISO = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

export default function CycleDetail({
  userId,
  cycle,
  onBack,
  onUpdateCycleStage,
}: CycleDetailProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [activeTab, setActiveTab] = useState<"logs" | "photos">("logs");
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [isDeletingLog, setIsDeletingLog] = useState(false);

  // Form State
  const [logDate, setLogDate] = useState<string>(() => getCurrentLocalISO());
  const [ec, setEc] = useState<string>("");
  const [ph, setPh] = useState<string>("");
  const [waterVolume, setWaterVolume] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [photoBase64, setPhotoBase64] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [currentStage, setCurrentStage] = useState(cycle.stage);

  const handleConfirmDeleteLog = async () => {
    if (!deletingLogId) return;
    setIsDeletingLog(true);
    try {
      await deleteDoc(
        doc(db, "users", userId, "cycles", cycle.id, "logs", deletingLogId),
      );
      setLogs((prev) => prev.filter((l) => l.id !== deletingLogId));
      setDeletingLogId(null);
    } catch (err) {
      console.error("Error deleting log:", err);
    } finally {
      setIsDeletingLog(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const logsRef = collection(
          db,
          "users",
          userId,
          "cycles",
          cycle.id,
          "logs",
        );
        const q = query(logsRef, orderBy("timestamp", "asc"));
        const snapshot = await getDocs(q);
        const fetchedLogs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as LogEntry[];

        if (isMounted) {
          setLogs(fetchedLogs);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        if (isMounted) {
          setLoadingLogs(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
    };
  }, [cycle.id, userId]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        // Create canvas to downscale large phone photos
        const canvas = document.createElement("canvas");
        const MAX_DIMENSION = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, width, height);

        // Compress image to JPEG format with 0.7 quality to stay well under Firestore's 1MB limit
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setPhotoBase64(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ec || !ph) return;

    setSubmitting(true);
    try {
      // Use selected adjusted logDate or fallback to now
      const timestamp = logDate
        ? new Date(logDate).toISOString()
        : new Date().toISOString();

      // 1. Build document payload for Firestore
      const firestoreData: Record<string, unknown> = {
        ec: parseFloat(ec),
        ph: parseFloat(ph),
        waterVolume: waterVolume ? parseFloat(waterVolume) : 0,
        notes: notes.trim(),
        timestamp,
        createdAt: serverTimestamp(),
      };

      if (photoBase64) {
        firestoreData.photoUrl = photoBase64;
      }

      const logsRef = collection(
        db,
        "users",
        userId,
        "cycles",
        cycle.id,
        "logs",
      );
      const docRef = await addDoc(logsRef, firestoreData);

      // 2. Update local UI state and keep sorted chronologically
      const newLog: LogEntry = {
        id: docRef.id,
        ec: parseFloat(ec),
        ph: parseFloat(ph),
        waterVolume: waterVolume ? parseFloat(waterVolume) : 0,
        notes: notes.trim(),
        photoUrl: photoBase64 || undefined,
        timestamp,
      };

      setLogs((prev) =>
        [...prev, newLog].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        ),
      );

      // 3. Reset form inputs and reset time picker to current
      setEc("");
      setPh("");
      setWaterVolume("");
      setNotes("");
      setPhotoBase64("");
      setLogDate(getCurrentLocalISO());
    } catch (err) {
      console.error("Error adding log:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const photoLogs = logs.filter((l) => l.photoUrl);

  const getDaysElapsed = (startDateStr: string) => {
    if (!startDateStr) return 0;
    const start = new Date(startDateStr);
    const now = new Date();

    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffInMs = now.getTime() - start.getTime();
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    return Math.max(1, days + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Stage Selector */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto">
          {(["Seedling", "Vegetative", "Flowering", "Harvested"] as const).map(
            (stage) => (
              <button
                key={stage}
                onClick={async () => {
                  const cycleRef = doc(db, "users", userId, "cycles", cycle.id);
                  await updateDoc(cycleRef, { stage });
                  setCurrentStage(stage);
                  onUpdateCycleStage(cycle.id, stage);
                }}
                className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  currentStage === stage
                    ? "bg-botanical-600 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {stage}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Cycle Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              {cycle.stage && (
                <span
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-botanical-950 border ${cycle.stage === "Seedling" ? "border-sky-600" : cycle.stage === "Vegetative" ? "border-botanical-800" : "border-amber-300"}`}
                >
                  {cycle.stage}
                </span>
              )}

              {cycle.environment && (
                <span
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-slate-800 text-slate-300 border ${cycle.environment === "Indoor" ? "border-purple-800" : cycle.environment === "Outdoor" ? "border-green-600" : "border-amber-800"} `}
                >
                  {cycle.environment}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-2">
              {cycle.strainName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Medium:{" "}
              <span className="text-slate-200 font-medium">{cycle.medium}</span>
              {cycle.lightSpec ? ` | Lighting: ${cycle.lightSpec}` : ""}
            </p>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                <span>Started {cycle.startDate}</span>
                <span>•</span>
                <span className="text-slate-400 font-medium">
                  Day {getDaysElapsed(cycle.startDate)}
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Photos Recorded: {photoLogs.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* EC Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-botanical-400" />
          <span>Fertigation & EC Trends</span>
        </h3>
        <div className="h-64 w-full">
          {logs.length > 0 ? (
            <EcChart readings={logs} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No logs recorded yet. Add your first fertigation reading below.
            </div>
          )}
        </div>
      </div>

      {/* Main Content View Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Log Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-botanical-400" />
            <span>Log Daily Activity & Photo</span>
          </h3>

          <form onSubmit={handleAddLog} className="space-y-4">
            {/* Date & Time Adjustment Input */}
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-botanical-400" />
                <span>Log Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500 scheme-dark"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  EC Reading
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={ec}
                  onChange={(e) => setEc(e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  pH Level
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={ph}
                  onChange={(e) => setPh(e.target.value)}
                  placeholder="e.g. 5.8"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Water Volume (Liters)
              </label>
              <input
                type="number"
                step="0.5"
                value={waterVolume}
                onChange={(e) => setWaterVolume(e.target.value)}
                placeholder="e.g. 5.0"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Attach Growth Photo
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  id="photo-input"
                  className="hidden"
                />
                <label
                  htmlFor="photo-input"
                  className="w-full cursor-pointer bg-slate-950 border border-dashed border-slate-700 hover:border-botanical-500 rounded-lg p-2.5 text-center text-xs text-slate-400 hover:text-slate-200 transition flex items-center justify-center space-x-2"
                >
                  <Camera className="w-4 h-4 text-botanical-400" />
                  <span>
                    {photoBase64 ? "Photo Selected ✓" : "Upload Canopy Snap"}
                  </span>
                </label>
              </div>
              {photoBase64 && (
                <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-800 h-24">
                  <Image
                    src={photoBase64}
                    alt="Preview"
                    width={800}
                    height={96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nutrient mix, canopy training, trichome density..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-botanical-600 hover:bg-botanical-500 text-slate-950 font-semibold rounded-lg transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Record Entry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* History / Photo Journal Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className=" border-b border-slate-800 pb-3">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between">
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === "logs"
                    ? "bg-botanical-600 text-slate-950"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span className="truncate">Fertigation Logs</span>
              </button>

              <button
                onClick={() => setActiveTab("photos")}
                className={`px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                  activeTab === "photos"
                    ? "bg-botanical-600 text-slate-950"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="truncate">
                  Photo Journal ({photoLogs.length})
                </span>
              </button>
            </div>
          </div>

          {activeTab === "logs" ? (
            <div className="space-y-3 max-h-115 overflow-y-auto pr-2">
              {loadingLogs ? (
                <div className="flex min-h-40 items-center justify-center text-slate-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Loading logs...
                </div>
              ) : logs.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center text-slate-500 text-xs">
                  No fertigation logs yet.
                </div>
              ) : (
                logs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <div
                      key={log.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3 text-xs font-semibold">
                          <span className="text-botanical-400">
                            EC: {log.ec}
                          </span>
                          <span className="text-sky-400">pH: {log.ph}</span>
                          {log.waterVolume ? (
                            <span className="text-slate-400">
                              {log.waterVolume}L
                            </span>
                          ) : null}
                          <span className="text-slate-500 font-normal text-[10px]">
                            {new Date(log.timestamp).toLocaleString([], {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-xs text-slate-400 italic">
                            {log.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 shrink-0">
                        {log.photoUrl && (
                          <Image
                            width={90}
                            height={90}
                            src={log.photoUrl}
                            alt="Log Snap"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                          />
                        )}
                        <button
                          onClick={() => setDeletingLogId(log.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition rounded-md"
                          title="Delete log entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          ) : (
            /* Photo Timeline Gallery */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-115 overflow-y-auto pr-2">
              {photoLogs.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500 text-xs">
                  No photos attached to cycle logs yet.
                </div>
              ) : (
                photoLogs
                  .slice()
                  .reverse()
                  .map((log) => (
                    <div
                      key={log.id}
                      className="group relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-36"
                    >
                      <Image
                        src={`${log.photoUrl}`}
                        width={90}
                        height={90}
                        alt="Journal Entry"
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to from-slate-950 via-transparent to-transparent p-2 flex flex-col justify-end opacity-90">
                        <span className="text-[10px] font-bold text-slate-200">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-[9px] text-botanical-400">
                          EC {log.ec} | pH {log.ph}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Log Entry Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingLogId}
        onClose={() => setDeletingLogId(null)}
        onConfirm={handleConfirmDeleteLog}
        title="Delete Reading Log"
        message="Are you sure you want to delete this fertigation reading entry? It will be removed from your chart metrics."
        loading={isDeletingLog}
      />
    </div>
  );
}
