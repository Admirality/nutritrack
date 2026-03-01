export const GOALS_STORAGE_KEY = "nutritrack-goals";

export type Goals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const DEFAULT_GOALS: Goals = {
  calories: 2800,
  protein: 180,
  carbs: 300,
  fat: 80,
};

export function loadGoals(): Goals {
  if (typeof window === "undefined") return DEFAULT_GOALS;
  try {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    return stored ? { ...DEFAULT_GOALS, ...JSON.parse(stored) } : DEFAULT_GOALS;
  } catch {
    return DEFAULT_GOALS;
  }
}
