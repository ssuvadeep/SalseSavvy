import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-xs tracking-widest uppercase text-sale font-bold">
            Welcome back
          </span>
          <h1 className="font-display font-800 text-4xl mt-2">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-ink/70 block mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-line rounded-md px-4 py-2.5 font-body bg-white/60 focus:outline-none focus:ring-2 focus:ring-sale/40 focus:border-sale"
              placeholder="yourname"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-ink/70 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-line rounded-md px-4 py-2.5 font-body bg-white/60 focus:outline-none focus:ring-2 focus:ring-sale/40 focus:border-sale"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sale text-sm font-body font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-ink text-paper font-body font-semibold rounded-full py-2.5 hover:bg-sale transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-ink/60 mt-6">
          New here?{" "}
          <Link to="/register" className="text-sale font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
