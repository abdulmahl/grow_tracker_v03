"use client";

import { useState } from "react";
import {
  Sprout,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  ChevronRight,
  CheckCircle2,
  SlidersHorizontal,
  Box,
  Zap,
  Activity,
  Droplet,
} from "lucide-react";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

export interface Cycle {
  id: string;
  strainName: string;
  stage: string;
  medium: string;
  startDate: string;
  tentSize?: string;
  lightSpec?: string;
  targetEc?: number;
  targetPh?: number;
  status?: "active" | "completed" | "archived";
  environment?: "Indoor" | "Outdoor";
  plantType?: string;
}

export interface DashboardProps {
  cycles: Cycle[];
  onSelectCycle: (cycleId: string) => void;
  onOpenNewCycleModal: () => void;
  onOpenEditModal: (cycle: Cycle) => void;
  onDeleteCycle: (cycleId: string) => Promise<void> | void;
}

export default function Dashboard({
  cycles,
  onSelectCycle,
  onOpenNewCycleModal,
  onOpenEditModal,
  onDeleteCycle,
}: DashboardProps) {
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("active");
  const [deletingCycle, setDeletingCycle] = useState<Cycle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCycles = cycles.filter((c) => {
    if (filterStatus === "active")
      return c.status !== "completed" && c.status !== "archived";
    if (filterStatus === "completed") return c.status === "completed";
    return true;
  });

  const handleConfirmDelete = async () => {
    if (!deletingCycle) return;
    setIsDeleting(true);
    try {
      await onDeleteCycle(deletingCycle.id);
      setDeletingCycle(null);
    } catch (err) {
      console.error("Error deleting cycle:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getDaysElapsed = (startDateStr: string) => {
    if (!startDateStr) return 0;
    const start = new Date(startDateStr);
    const now = new Date();

    // Reset hours to compare pure calendar dates
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffInMs = now.getTime() - start.getTime();
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // +1 so the start date counts as "Day 1"
    return Math.max(1, days + 1);
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-botanical-400" />
            <span>Active Cultivation Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage grow runs, fertigation targets, and canopy logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 ml-2 mr-1" />
            {(["active", "completed", "all"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition ${
                  filterStatus === status
                    ? "bg-botanical-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Add Cycle Button */}
          <button
            onClick={onOpenNewCycleModal}
            className="px-4 py-2 bg-botanical-500 hover:bg-botanical-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-botanical-950/40 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Cycle</span>
          </button>
        </div>
      </div>

      {/* Cycle Grid */}
      {filteredCycles.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-slate-300 font-semibold text-sm">
            No grow cycles found
          </h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            {filterStatus === "active"
              ? "You have no active cultivation runs. Start a new cycle to begin logging fertigation data."
              : "No cycles match the selected status filter."}
          </p>
          <button
            onClick={onOpenNewCycleModal}
            className="mt-2 inline-flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5 text-botanical-400" />
            <span>Start a New Cycle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCycles.map((cycle) => (
            <div
              key={cycle.id}
              onClick={() => onSelectCycle(cycle.id)}
              className="bg-slate-900 border border-slate-800 hover:border-botanical-500/50 rounded-2xl p-5 shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header Badges & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-botanical-950 text-botanical-400 border border-botanical-800">
                      {cycle.stage}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-botanical-950 text-botanical-400 border border-botanical-800">
                      {cycle.environment}
                    </span>
                    {cycle.status === "completed" && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Harvested</span>
                      </span>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div
                    className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg p-1 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onOpenEditModal(cycle)}
                      className="p-1.5 text-slate-400 hover:text-sky-400 transition rounded-md"
                      title="Edit Cycle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingCycle(cycle)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition rounded-md"
                      title="Delete Cycle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Strain Title & Medium */}
                <div className="mt-2">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-botanical-400 transition flex items-center justify-between">
                    <span>{cycle.strainName}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Medium:{" "}
                    <span className="text-slate-200 font-medium">
                      {cycle.medium}
                    </span>
                  </p>
                </div>

                {/* Target & Equipment Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Box className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <div>
                      <span className="block text-slate-500 text-[10px] uppercase font-semibold">
                        Setup
                      </span>
                      <span className="text-slate-300 font-medium truncate block">
                        {cycle.tentSize || "4x4 Tent"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <div>
                      <span className="block text-slate-500 text-[10px] uppercase font-semibold">
                        Light
                      </span>
                      <span className="text-slate-300 font-medium truncate block">
                        {cycle.lightSpec || "400W LED"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Activity className="w-3.5 h-3.5 text-botanical-400 shrink-0" />
                    <div>
                      <span className="block text-slate-500 text-[10px] uppercase font-semibold">
                        Target EC
                      </span>
                      <span className="text-botanical-400 font-bold">
                        {cycle.targetEc ?? 1400} µS/cm
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Droplet className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <div>
                      <span className="block text-slate-500 text-[10px] uppercase font-semibold">
                        Target pH
                      </span>
                      <span className="text-sky-400 font-bold">
                        {cycle.targetPh ?? 5.8}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Started {formatDate(cycle.startDate)}</span>
                  <span>•</span>
                  <span className="text-slate-400 font-medium">
                    Day {getDaysElapsed(cycle.startDate)}
                  </span>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCycle(cycle.id);
                  }}
                  className="px-3 py-1.5 bg-slate-800 group-hover:bg-botanical-500 group-hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center space-x-1"
                >
                  <span>Open Logs & Chart</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingCycle}
        onClose={() => setDeletingCycle(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Grow Run"
        itemName={deletingCycle?.strainName}
        message={`Are you sure you want to delete "${deletingCycle?.strainName}"? All logged EC/pH records and fertigation history for this cycle will be permanently removed.`}
        loading={isDeleting}
      />
    </div>
  );
}
