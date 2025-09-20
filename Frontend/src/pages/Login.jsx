import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const url = activeTab === "login" ? "http://localhost:8000/auth/login" : "http://localhost:8000/auth/register";
    const payload = activeTab === "login" ? { email, password } : { name, email, password };

    try {
      const response = await axios.post(url, payload);
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred.");
      console.error("Error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get("http://localhost:8000/auth/google");
      window.location.href = response.data.auth_url;
    } catch (err) {
      setError("Could not connect to Google login.");
      console.error("Error:", err);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl"
      >
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "login" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center font-semibold ${
              activeTab === "register" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            {activeTab === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-2 text-gray-400">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 flex items-center justify-center py-3 rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle size={24} className="mr-2" /> Continue with Google
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
