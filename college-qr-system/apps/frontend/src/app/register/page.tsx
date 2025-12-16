"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = ["admin", "student", "guard"];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState(roles[1]); // Default to student
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = role === "admin";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Creating account...");

    try {
      // Build payload according to role
      const payload: any = {
        name,
        email: email.toLowerCase(),
        password,
        role: role.toUpperCase(),
      };
      
      if (isAdmin) {
        payload.username = username;
      } else if (role === "guard") {
        payload.idNumber = idNumber;
      } else {
        payload.rollNumber = rollNumber;
      }

      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (isAdmin) {
        // Admin registration - redirect to waiting for approval page (skip OTP)
        setStatus("Registration successful! Redirecting...");
        setTimeout(() => {
          router.push(`/pending-approval?email=${encodeURIComponent(email.toLowerCase())}&name=${encodeURIComponent(name)}`);
        }, 1000);
      } else {
        // Student/Guard registration - needs email verification
        setStatus("Registration initiated! Redirecting to email verification...");
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(email.toLowerCase())}`);
        }, 1000);
      }
    } catch (err: any) {
      setStatus(err.message || "Registration failed");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur">
        <header className="space-y-1">
          <p className="text-sm uppercase tracking-[0.4em] text-purple-300">Register</p>
          <h1 className="text-3xl font-bold text-white">Create your campus access</h1>
          <p className="text-sm text-slate-400">
            {isAdmin 
              ? "Admin accounts require Super Admin approval before you can login."
              : "Choose a role to join the system. You'll verify your email to complete registration."}
          </p>
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
          
          {isAdmin ? (
            <label className="block text-sm font-medium text-slate-200">
              Username
              <input
                type="text"
                className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none transition focus:border-purple-400"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="Choose a unique username"
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
          
          {isAdmin && (
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 p-3 text-sm text-yellow-200">
              ⚠️ Admin accounts require approval from the Super Admin before you can login.
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : `Register as ${role}`}
          </button>
        </form>
        {status && (
          <p className={`text-center text-sm ${status.includes("failed") || status.includes("error") ? "text-red-400" : "text-emerald-300"}`}>
            {status}
          </p>
        )}
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="font-semibold text-white transition hover:text-purple-300" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}