"use client";

import { useState } from "react";
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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleModalClick = (modalName: string) => {
    onOpenModal(modalName);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-botanical-900/50 max-w-5xl w-full mx-auto sticky top-0 z-40 px-3 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Brand Logo & Title */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0"
          onClick={() => {
            onSwitchView("dashboard");
            setMobileMenuOpen(false);
          }}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-botanical-700 to-botanical-800 flex items-center justify-center shadow-lg shadow-botanical-900/50 shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-base hidden sm:block sm:text-lg font-bold tracking-tight bg-linear-to-r from-botanical-700 to-emerald-200 bg-clip-text text-transparent leading-tight">
              CannaGrow
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
              Cloud Cultivation Suite v03
            </p>
          </div>
        </div>

        {/* Right Header Navigation */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {!user ? (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold bg-botanical-600 hover:bg-botanical-500 text-slate-950 rounded-lg transition flex items-center space-x-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </button>
          ) : (
            <>
              {/* User Account Info */}
              <div className="flex items-center space-x-1.5 bg-slate-800/90 border border-slate-700/60 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5">
                <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-botanical-400 shrink-0" />
                <span className="text-xs font-medium text-slate-200 max-w-20 min-[380px]:max-w-30 sm:max-w-40 truncate">
                  {user.email}
                </span>
                <button
                  onClick={onLogout}
                  className="cursor-pointer text-slate-400 hover:text-rose-400 transition p-0.5"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Desktop Quick Action Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => onOpenModal("database")}
                  className="cursor-pointer px-3 py-1.5 text-xs md:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-800/60 rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Database className="w-4 h-4 text-sky-400" />
                  <span>Database</span>
                </button>

                <button
                  onClick={() => onOpenModal("reminders")}
                  className="cursor-pointer px-3 py-1.5 text-xs md:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/60 rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Reminders</span>
                </button>

                <button
                  onClick={() => onOpenModal("nutrient")}
                  className="cursor-pointer px-3 py-1.5 text-xs md:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-botanical-300 border border-botanical-800/60 rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                >
                  <FlaskConical className="w-4 h-4 text-botanical-400" />
                  <span>Nutrient Calc</span>
                </button>
              </div>

              {/* Always Visible Primary Action */}
              <button
                onClick={() => onOpenModal("cycle")}
                className="cursor-pointer px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-semibold bg-botanical-600 hover:bg-botanical-500 text-slate-950 rounded-lg transition flex items-center md:space-x-1 shadow-lg shadow-botanical-900/40 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden min-[400px]:inline">New Cycle</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="cursor-pointer md:hidden p-1.5 text-slate-300 hover:text-white bg-slate-800 border border-slate-700/60 rounded-lg transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer Dropdown for hidden quick actions */}
      {user && mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => handleModalClick("database")}
            className="cursor-pointer flex flex-col items-center justify-center p-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-sky-800/50 rounded-lg transition text-center gap-1"
          >
            <Database className="w-4 h-4 text-sky-400" />
            <span>Database</span>
          </button>

          <button
            onClick={() => handleModalClick("reminders")}
            className="cursor-pointer flex flex-col items-center justify-center p-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-800/50 rounded-lg transition text-center gap-1"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Reminders</span>
          </button>

          <button
            onClick={() => handleModalClick("nutrient")}
            className="cursor-pointer flex flex-col items-center justify-center p-2 text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-botanical-300 border border-botanical-800/50 rounded-lg transition text-center gap-1"
          >
            <FlaskConical className="w-4 h-4 text-botanical-400" />
            <span>Nutrients</span>
          </button>
        </div>
      )}
    </header>
  );
}
