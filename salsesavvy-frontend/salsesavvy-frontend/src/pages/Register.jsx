import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-mono text-xs tracking-widest uppercase text-sale font-bold">
            Get started
          </span>
          <h1 className="font-display font-800 text-4xl mt-2">Create account</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="font-body text-sm font-medium text-ink/70 block mb-1">
              Username
            </label>
            <input
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full border border-line rounded-md px-4 py-2.5 font-body bg-white/60 focus:outline-none focus:ring-2 focus:ring-sale/40 focus:border-sale"
              placeholder="yourname"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-ink/70 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-line rounded-md px-4 py-2.5 font-body bg-white/60 focus:outline-none focus:ring-2 focus:ring-sale/40 focus:border-sale"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="font-body text-sm font-medium text-ink/70 block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-line rounded-md px-4 py-2.5 font-body bg-white/60 focus:outline-none focus:ring-2 focus:ring-sale/40 focus:border-sale"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sale text-sm font-body font-medium">{String(error)}</p>
          )}
          {success && (
            <p className="text-sage text-sm font-body font-medium">
              Account created! Redirecting to sign in...
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-ink text-paper font-body font-semibold rounded-full py-2.5 hover:bg-sale transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-ink/60 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-sale font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
