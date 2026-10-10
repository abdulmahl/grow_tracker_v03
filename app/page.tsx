"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { collection, getDocs, query, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Header from "@/components/Header";
import AuthLanding from "@/components/AuthLanding";
import Dashboard from "@/components/Dashboard";
import CycleDetail from "@/components/CycleDetail";
import CreateCycleModal from "@/components/modals/CreateCycleModal";
import EditCycleModal from "@/components/modals/EditCycleModal";
import NutrientModal from "@/components/modals/NutrientModal";
import ReminderModal from "@/components/modals/ReminderModal";
import DatabaseModal from "@/components/modals/DatabaseModal";
import StrainGeneratorModal from "@/components/modals/StrainGeneratorModal";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<any[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);
  const [editingCycle, setEditingCycle] = useState<any | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const fetchCycles = async (uid: string) => {
    try {
      const cyclesRef = collection(db, "users", uid, "cycles");
      const snapshot = await getDocs(query(cyclesRef));
      const loadedCycles = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setCycles(loadedCycles);
    } catch (err) {
      console.error("Error loading cycles:", err);
    }
  };

  useEffect(() => {
    // onAuthStateChanged runs only on the client and handles initial sync safely
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchCycles(currentUser.uid);
      } else {
        setCycles([]);
        setSelectedCycleId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteCycle = async (cycleId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "cycles", cycleId));
      setCycles((prev) => prev.filter((c) => c.id !== cycleId));
      if (selectedCycleId === cycleId) {
        setSelectedCycleId(null);
      }
    } catch (err) {
      console.error("Error deleting cycle:", err);
    }
  };

  const handleUpdateCycleStage = (cycleId: string, newStage: string) => {
    setCycles((prev) =>
      prev.map((c) => (c.id === cycleId ? { ...c, stage: newStage } : c)),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading CannaGrow...
      </div>
    );
  }

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
      <Header
        user={user}
        onOpenAuth={() => setSelectedCycleId(null)}
        onLogout={() => signOut(auth)}
        onOpenModal={(modal) => setActiveModal(modal)}
        onSwitchView={() => setSelectedCycleId(null)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 lg:p-8">
        {!user ? (
          <AuthLanding />
        ) : selectedCycle ? (
          <CycleDetail
            userId={user.uid}
            cycle={selectedCycle}
            onBack={() => setSelectedCycleId(null)}
            onUpdateCycleStage={handleUpdateCycleStage}
          />
        ) : (
          <Dashboard
            cycles={cycles}
            onSelectCycle={(id) => setSelectedCycleId(id)}
            onOpenNewCycleModal={() => setActiveModal("cycle")}
            onOpenEditModal={(cycle) => setEditingCycle(cycle)}
            onDeleteCycle={handleDeleteCycle}
          />
        )}
      </main>

      {/* Render Modals */}
      {user && (
        <>
          <CreateCycleModal
            isOpen={activeModal === "cycle"}
            onClose={() => setActiveModal(null)}
            userId={user.uid}
            onCycleCreated={(newCycle) => {
              setCycles((prev) => [newCycle, ...prev]);
              setSelectedCycleId(newCycle.id);
            }}
          />

          {editingCycle && (
            <EditCycleModal
              key={editingCycle.id}
              isOpen={!!editingCycle}
              onClose={() => setEditingCycle(null)}
              userId={user.uid}
              cycle={editingCycle}
              onCycleUpdated={(updatedCycle) => {
                setCycles((prev) =>
                  prev.map((c) =>
                    c.id === updatedCycle.id ? updatedCycle : c,
                  ),
                );
                setEditingCycle(null);
              }}
            />
          )}

          <NutrientModal
            isOpen={activeModal === "nutrient"}
            onClose={() => setActiveModal(null)}
          />

          <ReminderModal
            isOpen={activeModal === "reminders"}
            onClose={() => setActiveModal(null)}
          />

          <DatabaseModal
            isOpen={activeModal === "database"}
            onClose={() => setActiveModal(null)}
            cycles={cycles}
            userId={user.uid}
          />

          <StrainGeneratorModal
            isOpen={activeModal === "strainGen"}
            onClose={() => setActiveModal(null)}
          />
        </>
      )}
    </div>
  );
}
