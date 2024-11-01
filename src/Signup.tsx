import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
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

    try {
      const response = await axios.post("http://localhost:8000/auth/", {
        username,
        password,
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError("An error occurred during sign up");
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-blue-900">
      <div className="flex flex-col rounded-lg px-8 py-4 bg-blue-950 shadow-sm shadow-blue-600">
        <h2 className="text-4xl font-bold text-center text-white p-4">
          Sign Up
        </h2>
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && (
            <p className="text-red-500 font-bold py-2 text-center">{error}</p>
          )}
        </form>
        <p className="text-center text-white py-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
