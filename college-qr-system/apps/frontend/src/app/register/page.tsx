"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = ["admin", "student", "guard"];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState(roles[1]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Creating account...");

    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      // Store user info in localStorage (in production, use proper auth state)
      const user = { name, email, role };
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    }, 800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur">
        <header className="space-y-1">
          <p className="text-sm uppercase tracking-[0.4em] text-purple-300">Register</p>
          <h1 className="text-3xl font-bold text-white">Create your campus access</h1>
          <p className="text-sm text-slate-400">
            Choose a role to join the system as a student, guard, or admin. You can switch roles at any time.
          </p>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-200">
            Full name
            <input
              className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              placeholder="Aarav Patel"
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="aarav@college.edu"
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Password
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Strong password"
            />
          </label>
          <label className="block text-sm font-medium text-slate-200">
            Role
            <select
              className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {roles.map((option) => (
                <option key={option} value={option} className="text-slate-900">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : `Register as ${role}`}
          </button>
        </form>
        {status && <p className="text-center text-sm text-emerald-300">{status}</p>}
        <p className="text-center text-sm text-slate-400">
          Already have an account? {" "}
          <Link className="font-semibold text-white transition hover:text-purple-300" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}