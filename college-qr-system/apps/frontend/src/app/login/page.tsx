"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = ["admin", "student", "guard"];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState(roles[1]); // Default to student
  const [rollNumber, setRollNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = role === "admin";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Signing in...");
    // Build payload according to role
    const payload: any = { email: email.toLowerCase(), password, role: role.toUpperCase() };
    if (isAdmin) payload.username = username;
    else if (role === "guard") payload.idNumber = idNumber;
    else payload.rollNumber = rollNumber;

    fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        // Store token and user
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setStatus("Login successful");
        router.push("/dashboard");
      })
      .catch((err: Error) => {
        setStatus(err.message);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur">
        <header className="space-y-1">
          <p className="text-sm uppercase tracking-[0.4em] text-purple-300">Login</p>
          <h1 className="text-3xl font-bold text-white">Access the campus control center</h1>
          <p className="text-sm text-slate-400">Use your registered credentials and role to access the right dashboards.</p>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          
          {isAdmin ? (
            <label className="block text-sm font-medium text-slate-200">
              Username
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="Enter your username"
              />
            </label>
          ) : role === "guard" ? (
            <label className="block text-sm font-medium text-slate-200">
              ID number
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
                value={idNumber}
                onChange={(event) => setIdNumber(event.target.value)}
                required
                placeholder="G-12345"
              />
            </label>
          ) : (
            <label className="block text-sm font-medium text-slate-200">
              Roll number
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
                value={rollNumber}
                onChange={(event) => setRollNumber(event.target.value)}
                required
                placeholder="2025BCS001"
              />
            </label>
          )}
          
          <label className="block text-sm font-medium text-slate-200">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
              value={email}
              onChange={(event) => setEmail(event.target.value.toLowerCase())}
              required
              placeholder="user@college.edu"
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
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-linear-to-r from-slate-800 to-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : `Sign in as ${role}`}
          </button>
        </form>
        {status && <p className="text-center text-sm text-emerald-300">{status}</p>}
        <p className="text-center text-sm text-slate-400">
          Need to onboard a new role? {" "}
          <Link className="font-semibold text-white transition hover:text-purple-300" href="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}