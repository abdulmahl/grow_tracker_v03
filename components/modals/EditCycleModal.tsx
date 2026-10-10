"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { X, Edit3, Loader2, Save } from "lucide-react";

interface EditCycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  cycle: {
    id: string;
    strainName: string;
    environment: "Indoor" | "Outdoor" | "Green House";
    stage: string;
    medium: string;
    startDate: string;
    tentSize?: string;
    lightSpec?: "Sunlight" | "Grow Light";
    targetEc?: number;
    targetPh?: number;
    notes?: string;
    status?: "active" | "completed" | "archived";
  } | null;
  onCycleUpdated: (
    updatedCycle: NonNullable<EditCycleModalProps["cycle"]>,
  ) => void;
}

export default function EditCycleModal({
  isOpen,
  onClose,
  userId,
  cycle,
  onCycleUpdated,
}: EditCycleModalProps) {
  // Initialize state directly from props (No useEffect needed)
  const [strainName, setStrainName] = useState(cycle?.strainName || "");
  const [environment, setEnvironment] = useState<
    "Indoor" | "Outdoor" | "Green House"
  >(cycle?.environment || "Indoor");
  const [stage, setStage] = useState(cycle?.stage || "Vegetative");
  const [medium, setMedium] = useState(
    cycle?.medium || "Coco Coir / Perlite (80/20)",
  );
  const [tentSize, setTentSize] = useState(cycle?.tentSize || "4x4 Tent");
  const [lightSpec, setLightSpec] = useState<"Sunlight" | "Grow Light">(
    cycle?.lightSpec || "Grow Light",
  );
  const [targetEc, setTargetEc] = useState(
    cycle?.targetEc ? String(cycle.targetEc) : "1400",
  );
  const [targetPh, setTargetPh] = useState(
    cycle?.targetPh ? String(cycle.targetPh) : "5.8",
  );
  const [status, setStatus] = useState<"active" | "completed" | "archived">(
    cycle?.status || "active",
  );
  const [notes, setNotes] = useState(cycle?.notes || "");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !cycle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const cycleRef = doc(db, "users", userId, "cycles", cycle.id);
      const updatedData = {
        strainName,
        environment,
        stage,
        medium,
        tentSize,
        lightSpec,
        targetEc: parseFloat(targetEc) || 1.4,
        targetPh: parseFloat(targetPh) || 5.8,
        status,
        notes,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(cycleRef, updatedData);
      onCycleUpdated({ ...cycle, ...updatedData });
      onClose();
    } catch (err) {
      console.error("Error updating cycle:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-botanical-500/20 text-botanical-400 flex items-center justify-center">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Edit Grow Cycle Specs</h3>
            <p className="text-xs text-slate-400">
              Modify environment, targets, or cycle status
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Strain Moniker
            </label>
            <input
              type="text"
              required
              value={strainName}
              onChange={(e) => setStrainName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Current Growth Stage
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500 capitalize"
              >
                <option value="seedling">Seedling</option>
                <option value="vegetative">Vegetative</option>
                <option value="flowering">Flowering</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Cycle Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "active" | "completed" | "archived",
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500 capitalize"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Setup
              </label>
              <input
                type="text"
                value={tentSize}
                onChange={(e) => setTentSize(e.target.value)}
                placeholder="e.g. 4x4 Grow Tent"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Light Source
              </label>
              <select
                value={lightSpec}
                onChange={(e) =>
                  setLightSpec(e.target.value as "Sunlight" | "Grow Light")
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
              >
                <option value="Sunlight">Sunlight</option>
                <option value="Grow Light">Grow Light</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Substrate & Medium Ratio
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. Coco Coir / Perlite (70/30)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Environment
              </label>
              <select
                value={environment}
                onChange={(e) =>
                  setEnvironment(
                    e.target.value as "Indoor" | "Outdoor" | "Green House",
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500 capitalize"
              >
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Green House">Green House</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target EC Target (µS/cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetEc}
                onChange={(e) => setTargetEc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target pH Target
              </label>
              <input
                type="number"
                step="0.1"
                value={targetPh}
                onChange={(e) => setTargetPh(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Cycle Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Genetics lineage, pot size, topping plans..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-botanical-600 hover:bg-botanical-500 text-slate-950 font-bold rounded-lg transition flex items-center justify-center space-x-2 text-xs shadow-lg disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
