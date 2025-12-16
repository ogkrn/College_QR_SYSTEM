"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DashboardUser = { name: string; email: string; role: string; rollNumber?: string; idNumber?: string };

type DashboardVariant = {
	quickActions: { label: string; href: string; icon: string }[];
	stats: { label: string; value: string; trend?: string }[];
	activity: { title: string; description: string; time: string }[];
	heroNote: string;
};

const dashboardConfig: Record<string, DashboardVariant> = {
	student: {
		heroNote: "Track your attendance and outing approvals at a glance.",
		quickActions: [
			{ label: "Scan QR Code", href: "/qr", icon: "📱" },
			{ label: "Attendance", href: "/attendance", icon: "📊" },
			{ label: "Leave Requests", href: "/leave", icon: "📝" },
			{ label: "Settings", href: "/settings", icon: "⚙️" },
		],
		stats: [
			{ label: "Total Scans Today", value: "24" },
			{ label: "Pending Requests", value: "3" },
			{ label: "Attendance Rate", value: "92%" },
		],
		activity: [
			{ title: "Gate Entry Scan", description: "Main Gate • Verified", time: "2 min ago" },
			{ title: "Outing Request Approved", description: "Library Visit • 2 hours", time: "1 hour ago" },
			{ title: "QR Code Refreshed", description: "Auto-rotation complete", time: "3 hours ago" },
		],
	},
	admin: {
		heroNote: "Monitor students, review outings, and approve leaves from one control deck.",
		quickActions: [
			{ label: "View Student List", href: "/students", icon: "👥" },
			{ label: "All Outings", href: "/outings", icon: "🗓️" },
			{ label: "Approve Leave", href: "/leave/approve", icon: "✅" },
			{ label: "System Settings", href: "/settings", icon: "⚙️" },
		],
		stats: [
			{ label: "Guard Alerts", value: "4" },
			{ label: "Pending Approvals", value: "6" },
			{ label: "API Errors", value: "0" },
		],
		activity: [
			{ title: "Password Reset", description: "Student 24 requested", time: "5 min ago" },
			{ title: "Guard Role Updated", description: "Sanjay activated", time: "20 min ago" },
			{ title: "Database Sync", description: "Pulse check completed", time: "45 min ago" },
		],
	},
	super_admin: {
		heroNote: "Approve admin registrations, manage attendance, and control system settings.",
		quickActions: [
			{ label: "Register Admin", href: "/admins/requests", icon: "👑" },
			{ label: "Attendance", href: "/attendance", icon: "📊" },
			{ label: "Leave Requests", href: "/leave/approve", icon: "📝" },
			{ label: "Settings", href: "/settings", icon: "⚙️" },
		],
		stats: [
			{ label: "Pending Admin Requests", value: "0" },
			{ label: "Active Admins", value: "0" },
			{ label: "System Health", value: "100%" },
		],
		activity: [
			{ title: "System Ready", description: "All services operational", time: "Now" },
		],
	},
	guard: {
		heroNote: "Scan QR codes, verify outings, and report incidents in seconds.",
		quickActions: [
			{ label: "QR Code", href: "/scan", icon: "📸" },
			{ label: "Outing Requests", href: "/outing", icon: "🚪" },
			{ label: "Extended Time", href: "/extended-time", icon: "⏱️" },
			{ label: "Leave Scanner", href: "/leave/scanner", icon: "🧾" },
			{ label: "Support", href: "/support", icon: "💬" },
		],
		stats: [
			{ label: "Entries Managed", value: "128" },
			{ label: "Alerts Resolved", value: "12" },
			{ label: "Shift Hours", value: "5h 30m" },
		],
		activity: [
			{ title: "QR Scan Passed", description: "North Gate verified", time: "Just now" },
			{ title: "Visitor Logged", description: "Reception handed badge", time: "30 min ago" },
			{ title: "Incident Cleared", description: "Gate breach false alarm", time: "1h ago" },
		],
	},
};

export default function DashboardPage() {
	const [user, setUser] = useState<DashboardUser | null>(null);

	useEffect(() => {
		const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			setUser({ name: "Demo User", email: "demo@college.edu", role: "student", rollNumber: "2025BCS000" });
		}
	}, []);

	if (!user) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
				<p>Loading...</p>
			</div>
		);
	}

	// Normalize role to lowercase for config lookup
	const normalizedRole = user.role.toLowerCase();
	const config = dashboardConfig[normalizedRole] || dashboardConfig.student;

	const roleColors: Record<string, string> = {
		admin: "from-rose-500 to-orange-500",
		student: "from-indigo-500 to-purple-500",
		guard: "from-emerald-500 to-teal-500",
		super_admin: "from-purple-600 to-pink-600",
	};

	const roleIcons: Record<string, string> = {
		admin: "🛡️",
		student: "🎓",
		guard: "🚪",
		super_admin: "👑",
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<header className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
					<h1 className="text-xl font-bold">College QR Portal</h1>
				<div className="flex items-center gap-4">
					<span className="text-sm text-slate-400">
						{roleIcons[normalizedRole]} {normalizedRole === 'super_admin' ? 'Super Admin' : normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)}
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

			<main className="mx-auto max-w-6xl px-6 py-8">
				<section
					className={`mb-8 rounded-3xl bg-linear-to-br ${roleColors[normalizedRole] || roleColors.student} p-8 shadow-2xl`}
				>
					<p className="text-sm uppercase tracking-widest text-white/70">Welcome back</p>
					<p className="mt-2 text-3xl font-bold">{user.name}</p>
					<p className="mt-1 text-white/80">{user.email}</p>
					{normalizedRole === 'super_admin' ? (
						<div className="mt-1 text-sm text-slate-400">Username: {(user as any).username ?? "Admin@1"}</div>
					) : normalizedRole === 'guard' ? (
						<div className="mt-1 text-sm text-slate-400">ID number: {(user as any).idNumber ?? "N/A"}</div>
					) : (
						<div className="mt-1 text-sm text-slate-400">Roll number: {user.rollNumber ?? "N/A"}</div>
					)}
					<div className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
						{roleIcons[normalizedRole]} {normalizedRole === 'super_admin' ? 'Super Admin' : normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)} Dashboard
					</div>
					<p className="mt-3 text-sm text-white/80">{config.heroNote}</p>
				</section>

				<section className="mb-8">
					<h3 className="mb-4 text-lg font-semibold text-slate-300">Quick Actions</h3>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{config.quickActions.map((action) => (
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

				<section className="mb-8">
					<h3 className="mb-4 text-lg font-semibold text-slate-300">Overview</h3>
					<div className="grid gap-4 sm:grid-cols-3">
						{config.stats.map((stat) => (
							<div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
								<p className="text-sm text-slate-400">{stat.label}</p>
								<p className="mt-2 text-3xl font-bold">{stat.value}</p>
								{stat.trend && <p className="text-xs text-slate-400">{stat.trend}</p>}
							</div>
						))}
					</div>
				</section>

				<section>
					<h3 className="mb-4 text-lg font-semibold text-slate-300">Recent Activity</h3>
					<div className="rounded-2xl border border-white/10 bg-white/5 p-6">
						<ul className="space-y-3">
							{config.activity.map((item) => (
								<li
									key={item.title}
									className="flex items-center justify-between border-b border-white/5 pb-3 last:border-none last:pb-0"
								>
									<div>
										<p className="font-medium">{item.title}</p>
										<p className="text-sm text-slate-400">{item.description}</p>
									</div>
									<span className="text-sm text-slate-500">{item.time}</span>
								</li>
							))}
						</ul>
					</div>
				</section>
			</main>
		</div>
	);
}
