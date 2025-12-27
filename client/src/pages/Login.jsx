import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-2xl border border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tighter">
          LOGIN
        </h2>
        {error && (
          <p className="mb-4 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-black p-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-black p-3 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 font-bold text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
          >
            SIGN IN
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold underline hover:no-underline">
            Sign up
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link
            to="/forgot-password"
            className="font-bold underline hover:no-underline"
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
