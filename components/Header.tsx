"use client";

import { User } from "firebase/auth";
import {
  Sprout,
  LogIn,
  UserCheck,
  LogOut,
  Bell,
  FlaskConical,
  Plus,
  Database,
} from "lucide-react";

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenModal: (modalName: string) => void;
  onSwitchView: (view: string) => void;
}

export default function Header({
  user,
  onOpenAuth,
  onLogout,
  onOpenModal,
  onSwitchView,
}: HeaderProps) {
  return (
    <header className="bg-slate-900/80 p-5 backdrop-blur-md border-b border-botanical-900/50 max-w-5xl w-full mx-auto sticky top-0 z-40 lg:px-8 py-4 flex items-center justify-between">
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => onSwitchView("dashboard")}
      >
        <div className="w-10 h-10 rounded-xl bg-linear-to from-botanical-500 to-botanical-800 flex items-center justify-center shadow-lg shadow-botanical-900/50">
          <Sprout className="w-6 h-6 text-slate-950" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight bg-linear-to from-botanical-400 to-emerald-200 bg-clip-text text-transparent">
            CannaGrow Manager
          </h1>
          <p className="text-xs text-slate-400 hidden md:flex">
            Next.js Cloud Cultivation Suite
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        {!user ? (
          <button
            onClick={onOpenAuth}
            className="px-3 py-2 text-xs md:text-sm font-semibold bg-botanical-600 hover:bg-botanical-500 text-slate-950 rounded-lg transition flex items-center space-x-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </button>
        ) : (
          <>
            <div className="flex items-center space-x-2 bg-slate-800/90 border border-slate-700/60 rounded-lg px-2.5 py-1.5">
              <UserCheck className="w-4 h-4 text-botanical-400" />
              <span className="text-xs font-medium text-slate-200 max-w-30 sm:max-w-45 truncate">
                {user.email}
              </span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 transition p-1"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* <button
              onClick={() => onOpenModal("strainGen")}
              className="hidden lg:flex px-3 py-2 text-xs md:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-800/60 rounded-lg transition items-center space-x-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Strain Gen</span>
            </button> */}

            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Database Modal Button */}
              <button
                onClick={() => onOpenModal("database")}
                className="hidden md:flex px-3 py-2 text-xs md:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-800/60 rounded-lg transition items-center space-x-1.5 shadow-sm"
              >
                <Database className="w-4 h-4 text-sky-400" />
                <span>Database</span>
              </button>

              {/* Reminders Button */}
              <button
                onClick={() => onOpenModal("reminders")}
                className="hidden md:flex px-3 py-2 text-xs md:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/60 rounded-lg transition items-center space-x-1.5 shadow-sm"
              >
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Reminders</span>
              </button>

              {/* Nutrient Calc Button */}
              <button
                onClick={() => onOpenModal("nutrient")}
                className="hidden sm:flex px-3 py-2 text-xs md:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-botanical-300 border border-botanical-800/60 rounded-lg transition items-center space-x-1.5 shadow-sm"
              >
                <FlaskConical className="w-4 h-4 text-botanical-400" />
                <span>Nutrient Calc</span>
              </button>

              {/* New Cycle Button */}
              <button
                onClick={() => onOpenModal("cycle")}
                className="px-3 py-2 text-xs md:text-sm font-semibold bg-botanical-600 hover:bg-botanical-500 text-slate-950 rounded-lg transition flex items-center space-x-1.5 shadow-lg shadow-botanical-900/40"
              >
                <Plus className="w-4 h-4" />
                <span>New Cycle</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
