"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateRandomStrainName } from "@/lib/constants";
import { X, Sprout, Sparkles, Loader2 } from "lucide-react";

interface CycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onCycleCreated: (newCycle: any) => void;
}

export default function CreateCycleModal({
  isOpen,
  onClose,
  userId,
  onCycleCreated,
}: CycleModalProps) {
  const [strainName, setStrainName] = useState("");
  const [environment, setEnvironment] = useState("Indoor");
  const [medium, setMedium] = useState("Coco/Perlite");
  const [stage, setStage] = useState("seedling");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleGenerateStrain = () => {
    setStrainName(generateRandomStrainName());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strainName.trim()) {
      setError("Strain name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cycleData = {
        strainName,
        environment,
        medium,
        stage,
        startDate,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "users", userId, "cycles"),
        cycleData,
      );
      onCycleCreated({ id: docRef.id, ...cycleData });
      setStrainName("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create cycle.");
    } finally {
      setLoading(false);
    }
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
          <div className="w-9 h-9 rounded-xl bg-botanical-600/20 text-botanical-400 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Start New Cycle</h3>
            <p className="text-xs text-slate-400">
              Initialize a new grow tracking run
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Strain Name
              </label>
              <button
                type="button"
                onClick={handleGenerateStrain}
                className="text-[11px] text-botanical-400 hover:underline flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Generate</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={strainName}
              onChange={(e) => setStrainName(e.target.value)}
              placeholder="e.g. Blue Dream, Gorilla Breath"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-botanical-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Growing Medium
            </label>
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-botanical-500"
            >
              <option value="Coco/Perlite">Coco / Perlite</option>
              <option value="Soil / Organic">Soil / Organic</option>
              <option value="DWC / Hydroponics">DWC / Hydroponics</option>
              <option value="Rockwool">Rockwool</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-botanical-500"
            >
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Starting Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-botanical-500"
            >
              <option value="seedling">Seedling</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-botanical-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-botanical-600 hover:bg-botanical-500 text-slate-950 font-semibold rounded-lg transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 mt-6"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Create Cycle</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
