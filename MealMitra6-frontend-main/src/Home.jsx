import React from "react";
import { useNavigate } from "react-router-dom";
import FoodMap from "./components/FoodMap";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-lime-200 flex flex-col items-center justify-start">
      <section className="text-center px-4 sm:px-6 w-full max-w-2xl lg:max-w-3xl mb-12 sm:mb-16 pt-8 sm:pt-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3 sm:mb-4 leading-tight">
          Welcome to MealMitra
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8 max-w-md mx-auto">
          Connect with your community by sharing food and meals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-10">
          <button
            onClick={() => navigate("/login")}
            className="border-2 border-green-600 text-green-700 px-6 py-3 rounded-full hover:bg-green-100 hover:shadow-md transition-all duration-300 font-semibold text-lg"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/userchoice")}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 hover:shadow-md transition-all duration-300 font-semibold text-lg"
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={() => navigate("/Getchoice")}
          className="bg-lime-500 text-white px-8 py-4 rounded-full hover:bg-lime-600 hover:shadow-lg transition-all duration-300 font-bold text-xl tracking-wide shadow-md"
        >
          Get Started
        </button>
      </section>

      <div className="w-full bg-white py-12 sm:py-16 flex justify-center">
        <section className="w-full max-w-4xl px-4 sm:px-6 flex flex-col lg:flex-row items-start lg:space-x-8">
          <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
            <h2 className="text-xl font-semibold text-green-700 mb-2 lg:hidden">Live View of Current Donations</h2>
            <div
              className="relative w-full overflow-hidden rounded-xl shadow-2xl"
              style={{ paddingTop: '56.25%' }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <FoodMap />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 pt-4">
            <h2 className="hidden lg:block text-3xl font-bold text-green-700 mb-4 border-b pb-2 border-green-300">
              Live View of Current Donations
            </h2>
            <p className="text-gray-600 text-lg">
              Explore the real-time food sharing activity happening right now in your community.
            </p>
          </div>
        </section>
      </div>
      <footer className="w-full bg-white text-center text-gray-600 text-sm py-4 border-t border-gray-200">
        Discover fresh, local meals and reduce food waste. Join the MealMitra movement!
      </footer>
    </div>
  );
}