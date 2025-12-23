import Card from "./Card";

export default function Dashboard() {
  const meals = [
    { title: "Spaghetti", description: "Delicious pasta with tomato sauce" },
    { title: "Pizza", description: "Cheesy goodness with toppings" },
    { title: "Salad", description: "Fresh veggies with healthy dressing" },
  ];

  return (
    <div className="min-h-screen py-10 px-6 bg-green-50">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {meals.map((meal, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">{meal.title}</h2>
              <p className="text-gray-700">{meal.description}</p>
            </div>
            <button className="mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              Claim
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
