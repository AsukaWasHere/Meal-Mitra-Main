import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-green-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold tracking-widest">MealMitra</Link>
        
        <div className="flex items-center space-x-3">
          <Link to="/" className="px-4 py-2 rounded-full hover:bg-green-700 transition font-medium">Home</Link>
          <Link to="/about" className="px-4 py-2 rounded-full hover:bg-green-700 transition font-medium">About</Link>
          
          {user ? (
            <>
              <Link to="/getchoice" className="px-4 py-2 rounded-full hover:bg-green-700 transition font-medium">Dashboard</Link>
              <Link to="/cart" className="px-4 py-2 rounded-full hover:bg-green-700 transition font-medium">Cart</Link>
              <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition font-medium">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-full hover:bg-green-700 transition font-medium">Login</Link>
              <Link to="/userchoice" className="px-4 py-2 rounded-full bg-green-700 hover:bg-green-600 transition font-medium">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}