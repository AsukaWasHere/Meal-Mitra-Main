import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import AuthContext from "./context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/api/auth/login", formData);
      login(response.data.token);
      navigate("/getchoice");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm text-center border-t-4 border-green-500">
        <h2 className="text-3xl font-extrabold mb-8 text-green-800">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="border-2 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-300" required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border-2 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-300" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 shadow-lg transition">
            Access Account
          </button>
        </form>
        <div className="mt-6 pt-4 border-t">
            <p className="text-gray-600 text-sm">
                New to MealMitra? 
                <Link to="/userchoice" className="text-green-600 font-semibold hover:text-green-800 ml-1">
                    Create an Account
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;