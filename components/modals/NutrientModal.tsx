"use client";

import { useState } from "react";
import { X, FlaskConical, Calculator } from "lucide-react";
import { calculateNutrientDosage } from "@/lib/constants";

interface NutrientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NutrientModal({ isOpen, onClose }: NutrientModalProps) {
  const [volume, setVolume] = useState<number>(10);
  const [stage, setStage] = useState<string>("vegetative");

  if (!isOpen) return null;

  const dosage = calculateNutrientDosage(volume, stage);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-botanical-600/20 text-botanical-400 flex items-center justify-center">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Coco Feed Calculator</h3>
            <p className="text-xs text-slate-400">
              Calculates fertigation dosage by water volume
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Water Volume (Liters)
            </label>
            <input
              type="number"
              min="1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Growth Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200"
            >
              <option value="seedling">Seedling / Early Veg</option>
              <option value="vegetative">Full Veg</option>
              <option value="flowering">Bloom / Flower</option>
            </select>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-botanical-400 uppercase tracking-wider mb-2">
              Recommended Dosage
            </h4>
            <div className="flex justify-between text-xs">
              <span>Coco Micro:</span>{" "}
              <span className="font-bold text-slate-100">
                {dosage.micro} ml
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Grow:</span>{" "}
              <span className="font-bold text-slate-100">{dosage.gro} ml</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Bloom:</span>{" "}
              <span className="font-bold text-slate-100">
                {dosage.bloom} ml
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Cal-Mag:</span>{" "}
              <span className="font-bold text-slate-100">
                {dosage.calmag} ml
              </span>
            </div>
            <hr className="border-slate-800 my-2" />
            <div className="flex justify-between text-xs">
              <span>Target EC:</span>{" "}
              <span className="font-bold text-emerald-400">
                {dosage.ec} µS/cm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
