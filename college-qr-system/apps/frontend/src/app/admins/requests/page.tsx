"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminRequest = {
  id: string;
  name: string;
  email: string;
  username: string;
  createdAt: string;
  isVerified: boolean;
};

export default function AdminRequestsPage() {
  const [pendingAdmins, setPendingAdmins] = useState<AdminRequest[]>([]);
  const [approvedAdmins, setApprovedAdmins] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch pending admins
      const pendingRes = await fetch("http://localhost:4000/admins/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pendingData = await pendingRes.json();
      
      // Fetch all admins (approved ones)
      const allRes = await fetch("http://localhost:4000/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allData = await allRes.json();
      
      if (pendingRes.ok) {
        setPendingAdmins(pendingData.pendingAdmins || []);
      }
      if (allRes.ok) {
        // Filter to only show approved admins
        setApprovedAdmins((allData.admins || []).filter((a: any) => a.isApproved));
      }
    } catch (err) {
      setError("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleApprove = async (adminId: string) => {
    setActionLoading(adminId);
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/admins/${adminId}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setSuccessMessage("Admin approved successfully!");
        fetchAdmins(); // Refresh the lists
      } else {
        const data = await res.json();
        setError(data.error || "Failed to approve admin");
      }
    } catch (err) {
      setError("Failed to approve admin");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (adminId: string) => {
    if (!confirm("Are you sure you want to reject this admin request? This will delete their account.")) {
      return;
    }
    
    setActionLoading(adminId);
    setSuccessMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/admins/${adminId}/reject`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setSuccessMessage("Admin request rejected and removed.");
        fetchAdmins(); // Refresh the lists
      } else {
        const data = await res.json();
        setError(data.error || "Failed to reject admin");
      }
    } catch (err) {
      setError("Failed to reject admin");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Loading admin requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
              ← Back
            </Link>
            <h1 className="text-xl font-bold">Admin Registration Requests</h1>
          </div>
          <span className="text-sm text-slate-400">👑 Super Admin</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/20 border border-red-500/50 p-4 text-red-300">
            {error}
            <button onClick={() => setError("")} className="ml-4 text-sm underline">Dismiss</button>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 rounded-xl bg-emerald-500/20 border border-emerald-500/50 p-4 text-emerald-300">
            {successMessage}
            <button onClick={() => setSuccessMessage("")} className="ml-4 text-sm underline">Dismiss</button>
          </div>
        )}

        {/* Pending Admin Requests */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-300 flex items-center gap-2">
            <span className="text-yellow-400">⏳</span> Pending Requests
            {pendingAdmins.length > 0 && (
              <span className="ml-2 rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-300">
                {pendingAdmins.length}
              </span>
            )}
          </h2>
          
          {pendingAdmins.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">No pending admin requests</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{admin.name}</h3>
                      <p className="text-sm text-slate-400">Username: {admin.username}</p>
                      <p className="text-sm text-slate-400">Email: {admin.email}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Registered: {formatDate(admin.createdAt)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {admin.isVerified ? (
                          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                            ✓ Email Verified
                          </span>
                        ) : (
                          <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full">
                            ⏳ Email Not Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(admin.id)}
                        disabled={actionLoading === admin.id}
                        className="rounded-xl bg-emerald-600 px-6 py-2 font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Approve this admin"
                      >
                        {actionLoading === admin.id ? "..." : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(admin.id)}
                        disabled={actionLoading === admin.id}
                        className="rounded-xl bg-red-600/80 px-6 py-2 font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                      >
                        {actionLoading === admin.id ? "..." : "✕ Reject"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved Admins */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-300 flex items-center gap-2">
            <span className="text-emerald-400">✓</span> Approved Admins
            <span className="ml-2 rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
              {approvedAdmins.length}
            </span>
          </h2>
          
          {approvedAdmins.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-slate-400">No approved admins yet</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {approvedAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5"
                >
                  <h3 className="font-semibold">{admin.name}</h3>
                  <p className="text-sm text-slate-400">@{admin.username}</p>
                  <p className="text-sm text-slate-400">{admin.email}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Since {formatDate(admin.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
