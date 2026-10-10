"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Sprout, Lock, Mail, ArrowRight } from "lucide-react";

export default function AuthLanding() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-botanical-600/20 text-botanical-400 flex items-center justify-center mx-auto mb-3">
          <Sprout className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          {isSignUp ? "Create Cultivation Account" : "Welcome Back"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isSignUp
            ? "Sign up to start tracking grow runs"
            : "Log in to manage your grow cycles"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="grower@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-botanical-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-botanical-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-botanical-600 hover:bg-botanical-500 text-slate-950 font-semibold rounded-lg transition flex items-center justify-center space-x-2 text-sm"
        >
          <span>{isSignUp ? "Register" : "Sign In"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-botanical-400 hover:underline"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Need an account? Register here"}
        </button>
      </div>
    </div>
  );
}
