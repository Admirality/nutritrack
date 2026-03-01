"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Goals, DEFAULT_GOALS, GOALS_STORAGE_KEY } from "@/lib/goals";

const FIELDS: { key: keyof Goals; label: string; unit: string }[] = [
  { key: "calories", label: "Calories", unit: "kcal" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
];

export default function Settings() {
  const [form, setForm] = useState<Goals>(DEFAULT_GOALS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GOALS_STORAGE_KEY);
      if (stored) setForm({ ...DEFAULT_GOALS, ...JSON.parse(stored) });
    } catch {}
  }, []);

  function handleChange(key: keyof Goals, value: string) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: parseInt(value, 10) || 0 }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(form));
    setSaved(true);
  }

  return (
    <main className="flex flex-col flex-1 pb-6">
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-600 p-1 -ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <form onSubmit={handleSave} className="flex flex-col gap-4 px-4 pt-4">
        <section className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold mb-4">Daily Goals</h2>
          <div className="flex flex-col gap-4">
            {FIELDS.map(({ key, label, unit }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-gray-400">{unit} per day</p>
                </div>
                <input
                  type="number"
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  min="0"
                  className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className={`rounded-xl py-3 text-sm font-medium transition-colors ${
            saved
              ? "bg-gray-100 text-gray-500"
              : "bg-green-600 text-white"
          }`}
        >
          {saved ? "Saved!" : "Save Goals"}
        </button>
      </form>
    </main>
  );
}
