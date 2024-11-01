import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:8000/auth/api/token",
        formData
      );
      setLoading(false);

      if (response.data.access_token) {
        const data = await response.data;
        localStorage.setItem("token", data.access_token);
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occurred");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-900">
      <div className="flex flex-col rounded-lg px-8 py-4 bg-blue-950 shadow-sm shadow-blue-600">
        <h2 className="text-4xl font-bold text-center text-white p-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="my-4 block px-4 py-2 rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="my-4 block px-4 py-2 rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg text-white bg-blue-900 border-2 border-white w-full font-bold py-2 my-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <p className="text-red-500 font-bold py-2 text-center">{error}</p>
          )}
        </form>
        <p className="text-center text-white py-2">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
