"use client";

import { useState } from "react";
import { X, Bell, Plus, Check, Volume2 } from "lucide-react";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReminderModal({ isOpen, onClose }: ReminderModalProps) {
  const [reminders, setReminders] = useState([
    {
      id: "1",
      title: "Flush Substrate (Final Week)",
      dueDate: "2026-10-10",
      completed: false,
    },
    {
      id: "2",
      title: "Switch Light Schedule to 12/12",
      dueDate: "2026-10-15",
      completed: false,
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  if (!isOpen) return null;

  const enablePushNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        new Notification("CannaGrow Reminders Active", {
          body: "You will receive desktop push alerts for fertigation and light shifts.",
        });
      }
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    setReminders((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newTitle,
        dueDate: newDate,
        completed: false,
      },
    ]);
    setNewTitle("");
    setNewDate("");
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

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">
              Fertigation & Feed Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Browser push reminders & schedule alerts
            </p>
          </div>
        </div>

        {/* Web Push Toggle */}
        <button
          onClick={enablePushNotifications}
          className={`w-full mb-4 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition ${
            notificationsEnabled
              ? "bg-amber-950/40 border-amber-700 text-amber-300"
              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/50"
          }`}
        >
          <span className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Desktop Push Notifications</span>
          </span>
          <span className="text-[10px] uppercase font-bold text-amber-400">
            {notificationsEnabled ? "Active" : "Enable"}
          </span>
        </button>

        <form onSubmit={handleAddReminder} className="space-y-3 mb-5">
          <input
            type="text"
            required
            placeholder="e.g. Cal-Mag Top-Up, Defoliation"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
          />
          <div className="flex space-x-2">
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-botanical-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {reminders.map((r) => (
            <div
              key={r.id}
              onClick={() =>
                setReminders((prev) =>
                  prev.map((item) =>
                    item.id === r.id
                      ? { ...item, completed: !item.completed }
                      : item,
                  ),
                )
              }
              className={`p-3 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                r.completed
                  ? "bg-slate-950/40 border-slate-800/50 text-slate-500 line-through"
                  : "bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-500/50"
              }`}
            >
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-[10px] text-slate-500">Due: {r.dueDate}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                  r.completed
                    ? "bg-amber-500 border-amber-500 text-slate-950"
                    : "border-slate-700"
                }`}
              >
                {r.completed && <Check className="w-3.5 h-3.5 stroke-3" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
