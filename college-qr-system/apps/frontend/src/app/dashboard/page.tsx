"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    // In production, fetch user from API or context
    // For now, simulate a logged-in user from localStorage or default
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Default mock user for demo
      setUser({ name: "Demo User", email: "demo@college.edu", role: "student" });
    }
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    admin: "from-rose-500 to-orange-500",
    student: "from-indigo-500 to-purple-500",
    guard: "from-emerald-500 to-teal-500",
  };

  const roleIcons: Record<string, string> = {
    admin: "🛡️",
    student: "🎓",
    guard: "🚪",
  };

  const quickActions = [
    { label: "View QR Code", href: "/qr", icon: "📱" },
    { label: "Attendance", href: "/attendance", icon: "📊" },
    { label: "Outing Requests", href: "/outing", icon: "🚶" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">College QR Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {roleIcons[user.role]} {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
            <Link
              href="/login"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Welcome Card */}
        <section
          className={`mb-8 rounded-3xl bg-linear-to-br ${roleColors[user.role] || roleColors.student} p-8 shadow-2xl`}
        >
          <p className="text-sm uppercase tracking-widest text-white/70">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold">{user.name}</h2>
          <p className="mt-1 text-white/80">{user.email}</p>
          <div className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
            {roleIcons[user.role]} {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-300">Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats / Overview */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-slate-300">Overview</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Total Scans Today</p>
              <p className="mt-2 text-3xl font-bold">24</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Pending Requests</p>
              <p className="mt-2 text-3xl font-bold">3</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Attendance Rate</p>
              <p className="mt-2 text-3xl font-bold">92%</p>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h3 className="mb-4 text-lg font-semibold text-slate-300">Recent Activity</h3>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <ul className="space-y-3">
              <li className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <p className="font-medium">Gate Entry Scan</p>
                  <p className="text-sm text-slate-400">Main Gate • Verified</p>
                </div>
                <span className="text-sm text-slate-500">2 min ago</span>
              </li>
              <li className="flex items-center justify-between border-b border-white/5 pb-3">
                <div>
                  <p className="font-medium">Outing Request Approved</p>
                  <p className="text-sm text-slate-400">Library Visit • 2 hours</p>
                </div>
                <span className="text-sm text-slate-500">1 hour ago</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <p className="font-medium">QR Code Refreshed</p>
                  <p className="text-sm text-slate-400">Auto-rotation complete</p>
                </div>
                <span className="text-sm text-slate-500">3 hours ago</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
