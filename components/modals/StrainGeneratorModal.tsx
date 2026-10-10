"use client";

import { useState } from "react";
import { X, Sparkles, Copy, Check, Plus } from "lucide-react";

interface StrainGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStrain?: (name: string) => void;
}

const PREFIXES = [
  "Frosty",
  "Purple",
  "Electric",
  "Royal",
  "Guava",
  "Velvet",
  "Gorilla",
  "Tropical",
  "Citrus",
  "Vanilla",
  "Golden",
  "Sonic",
];

const SUFFIXES = [
  "Haze",
  "Kush",
  "Rampage",
  "GMO",
  "Breath",
  "Cake",
  "Diesel",
  "Gelato",
  "Dream",
  "Frost",
  "Cookies",
  "Punch",
];

export default function StrainGeneratorModal({
  isOpen,
  onClose,
  onSelectStrain,
}: StrainGeneratorModalProps) {
  const [generatedName, setGeneratedName] = useState<string>("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateName = () => {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const num = Math.floor(Math.random() * 99) + 1;
    setGeneratedName(`${prefix} ${suffix} #${num}`);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!generatedName) return;
    navigator.clipboard.writeText(generatedName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Strain Name Generator</h3>
            <p className="text-xs text-slate-400">
              Generate unique botanical titles for new genetics
            </p>
          </div>
        </div>

        {/* Display Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-4 my-4">
          {generatedName ? (
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-botanical-300 bg-clip-text text-transparent tracking-wide">
              {generatedName}
            </span>
          ) : (
            <span className="text-xs text-slate-500 italic">
              Click generate to craft a custom strain moniker
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={generateName}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition flex items-center justify-center space-x-2 text-sm shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Random Name</span>
          </button>

          {generatedName && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition flex items-center justify-center space-x-1.5"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "Copied!" : "Copy Name"}</span>
              </button>

              {onSelectStrain && (
                <button
                  onClick={() => {
                    onSelectStrain(generatedName);
                    onClose();
                  }}
                  className="py-2 bg-botanical-600 hover:bg-botanical-500 text-slate-950 font-semibold rounded-lg text-xs transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use in New Cycle</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
