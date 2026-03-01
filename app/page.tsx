"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Goals, DEFAULT_GOALS, loadGoals } from "@/lib/goals";

type FoodLog = {
  id: string;
  created_at: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const MACROS = [
  { key: "protein" as const, label: "Protein", color: "bg-blue-500" },
  { key: "carbs" as const, label: "Carbs", color: "bg-orange-400" },
  { key: "fat" as const, label: "Fat", color: "bg-purple-400" },
];

export default function Home() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);

  const [modalMeal, setModalMeal] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGoals(loadGoals());
    fetchLogs();
  }, []);

  async function fetchLogs() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const { data } = await supabase
      .from("food_logs")
      .select("*")
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString())
      .order("created_at", { ascending: true });

    setLogs(data ?? []);
    setLoading(false);
  }

  function openModal(meal: string) {
    setMealType(meal);
    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setModalMeal(meal);
  }

  function closeModal() {
    setModalMeal(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!foodName.trim() || !calories) return;
    setSaving(true);

    await supabase.from("food_logs").insert({
      meal_type: mealType,
      food_name: foodName.trim(),
      calories: parseInt(calories, 10),
      protein: protein ? parseInt(protein, 10) : null,
      carbs: carbs ? parseInt(carbs, 10) : null,
      fat: fat ? parseInt(fat, 10) : null,
    });

    setSaving(false);
    closeModal();
    fetchLogs();
  }

  const totalCalories = logs.reduce((sum, l) => sum + l.calories, 0);
  const totalProtein = logs.reduce((sum, l) => sum + (l.protein ?? 0), 0);
  const totalCarbs = logs.reduce((sum, l) => sum + (l.carbs ?? 0), 0);
  const totalFat = logs.reduce((sum, l) => sum + (l.fat ?? 0), 0);
  const remaining = goals.calories - totalCalories;

  const macroTotals = { protein: totalProtein, carbs: totalCarbs, fat: totalFat };

  const formValid = foodName.trim() && calories;

  return (
    <>
      <main className="flex flex-col flex-1 pb-6">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-green-600">NutriTrack</h1>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <Link href="/settings" className="text-gray-400 hover:text-gray-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </Link>
        </header>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Summary card */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            {/* Calories */}
            <div className="flex justify-between text-center mb-3">
              <div>
                <p className="text-2xl font-bold">{goals.calories}</p>
                <p className="text-xs text-gray-400">Goal</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{totalCalories}</p>
                <p className="text-xs text-gray-400">Eaten</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${remaining < 0 ? "text-red-500" : ""}`}>
                  {remaining}
                </p>
                <p className="text-xs text-gray-400">Remaining</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full ${remaining < 0 ? "bg-red-400" : "bg-green-500"}`}
                style={{ width: `${Math.min((totalCalories / goals.calories) * 100, 100)}%` }}
              />
            </div>

            {/* Macros */}
            <div className="flex flex-col gap-2">
              {MACROS.map(({ key, label, color }) => {
                const eaten = macroTotals[key];
                const goal = goals[key];
                const pct = Math.min((eaten / goal) * 100, 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{label}</span>
                      <span className="text-gray-500">{eaten}g / {goal}g</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`${color} h-1.5 rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Meal sections */}
          {loading ? (
            <p className="text-center text-sm text-gray-400 py-8">Loading...</p>
          ) : (
            MEAL_TYPES.map((meal) => {
              const items = logs.filter((l) => l.meal_type === meal);
              const mealCals = items.reduce((sum, l) => sum + l.calories, 0);
              return (
                <section key={meal} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h2 className="font-semibold">{meal}</h2>
                      {mealCals > 0 && (
                        <p className="text-xs text-gray-400">{mealCals} cal</p>
                      )}
                    </div>
                    <button
                      onClick={() => openModal(meal)}
                      className="text-green-600 text-sm font-medium"
                    >
                      + Add
                    </button>
                  </div>
                  {items.length === 0 ? (
                    <p className="text-sm text-gray-400">No items logged</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <li key={item.id} className="py-2 flex justify-between text-sm">
                          <span>{item.food_name}</span>
                          <span className="text-gray-500 text-right">
                            {item.calories} cal
                            {(item.protein != null || item.carbs != null || item.fat != null) && (
                              <span className="block text-xs text-gray-400">
                                {item.protein ?? 0}p · {item.carbs ?? 0}c · {item.fat ?? 0}f
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })
          )}
        </div>
      </main>

      {/* Log food modal */}
      {modalMeal && (
        <div
          className="fixed inset-0 bg-black/40 z-20 flex items-end"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-md mx-auto rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Log food</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Meal</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Food name</label>
                <input
                  type="text"
                  placeholder="e.g. Chicken breast"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Calories</label>
                <input
                  type="number"
                  placeholder="e.g. 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  min="0"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">Macros (g)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Protein", value: protein, set: setProtein },
                    { label: "Carbs", value: carbs, set: setCarbs },
                    { label: "Fat", value: fat, set: setFat },
                  ].map(({ label, value, set }) => (
                    <div key={label}>
                      <p className="text-xs text-gray-400 mb-1">{label}</p>
                      <input
                        type="number"
                        placeholder="0"
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        min="0"
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formValid}
                  className="flex-1 bg-green-600 text-white rounded-xl py-2 text-sm font-medium disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
