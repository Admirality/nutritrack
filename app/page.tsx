"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FoodLog = {
  id: string;
  created_at: string;
  meal_type: string;
  food_name: string;
  calories: number;
};

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];
const CALORIE_GOAL = 2000;

export default function Home() {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMeal, setModalMeal] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchLogs();
  }, []);

  function openModal(meal: string) {
    setMealType(meal);
    setFoodName("");
    setCalories("");
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
    });

    setSaving(false);
    closeModal();
    fetchLogs();
  }

  const consumed = logs.reduce((sum, l) => sum + l.calories, 0);
  const remaining = CALORIE_GOAL - consumed;

  return (
    <>
      <main className="flex flex-col flex-1 pb-6">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <h1 className="text-xl font-bold text-green-600">NutriTrack</h1>
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Calorie summary */}
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Calories</h2>
            <div className="flex justify-between text-center mb-3">
              <div>
                <p className="text-2xl font-bold">{CALORIE_GOAL}</p>
                <p className="text-xs text-gray-400">Goal</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{consumed}</p>
                <p className="text-xs text-gray-400">Eaten</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${remaining < 0 ? "text-red-500" : ""}`}>
                  {remaining}
                </p>
                <p className="text-xs text-gray-400">Remaining</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${remaining < 0 ? "bg-red-400" : "bg-green-500"}`}
                style={{ width: `${Math.min((consumed / CALORIE_GOAL) * 100, 100)}%` }}
              />
            </div>
          </section>

          {/* Meal sections */}
          {loading ? (
            <p className="text-center text-sm text-gray-400 py-8">Loading...</p>
          ) : (
            MEAL_TYPES.map((meal) => {
              const items = logs.filter((l) => l.meal_type === meal);
              const mealTotal = items.reduce((sum, l) => sum + l.calories, 0);
              return (
                <section key={meal} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h2 className="font-semibold">{meal}</h2>
                      {mealTotal > 0 && (
                        <p className="text-xs text-gray-400">{mealTotal} cal</p>
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
                          <span className="text-gray-500">{item.calories} cal</span>
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

      {/* Modal */}
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
                  disabled={saving || !foodName.trim() || !calories}
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
