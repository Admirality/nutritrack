const meals = [
  {
    label: "Breakfast",
    items: [{ name: "Oatmeal with berries", calories: 320, protein: 10 }],
  },
  {
    label: "Lunch",
    items: [{ name: "Grilled chicken salad", calories: 480, protein: 42 }],
  },
  {
    label: "Dinner",
    items: [],
  },
  {
    label: "Snacks",
    items: [],
  },
];

const goal = 2000;
const consumed = meals.flatMap((m) => m.items).reduce((sum, i) => sum + i.calories, 0);
const remaining = goal - consumed;

export default function Home() {
  return (
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
              <p className="text-2xl font-bold">{goal}</p>
              <p className="text-xs text-gray-400">Goal</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{consumed}</p>
              <p className="text-xs text-gray-400">Eaten</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{remaining}</p>
              <p className="text-xs text-gray-400">Remaining</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${Math.min((consumed / goal) * 100, 100)}%` }}
            />
          </div>
        </section>

        {/* Meal sections */}
        {meals.map((meal) => (
          <section key={meal.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{meal.label}</h2>
              <button className="text-green-600 text-sm font-medium">+ Add</button>
            </div>
            {meal.items.length === 0 ? (
              <p className="text-sm text-gray-400">No items logged</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {meal.items.map((item) => (
                  <li key={item.name} className="py-2 flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-gray-500">
                      {item.calories} cal · {item.protein}g protein
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
