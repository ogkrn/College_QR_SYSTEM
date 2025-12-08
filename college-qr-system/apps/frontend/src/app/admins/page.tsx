"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Admin = {
  id: string;
  name: string;
  email: string;
  username: string;
  isApproved: boolean;
  createdAt: string;
};

export default function ManageAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [pendingAdmins, setPendingAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending">("pending");

  useEffect(() => {
    // Check if user is super admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (user.role !== "super_admin") {
      router.push("/dashboard");
      return;
    }

    fetchAdmins();
  }, [router]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // Fetch approved admins
      const [allRes, pendingRes] = await Promise.all([
        fetch("http://localhost:4000/admins", { headers }),
        fetch("http://localhost:4000/admins/pending", { headers }),
      ]);

      if (!allRes.ok) throw new Error("Failed to load admins");
      if (!pendingRes.ok) throw new Error("Failed to load pending admins");

      const allJson = await allRes.json();
      const pendingJson = await pendingRes.json();

      setAdmins(allJson.admins || allJson);
      setPendingAdmins(pendingJson.admins || pendingJson);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (adminId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/admins/${adminId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to approve admin");
      }

      // Refresh lists
      await fetchAdmins();
      alert("Admin approved successfully!");
    } catch (error) {
      console.error("Error approving admin:", error);
      alert("Failed to approve admin");
    }
  };

  const handleReject = async (adminId: string) => {
    if (!confirm("Are you sure you want to reject this admin request?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/admins/${adminId}/reject`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reject admin");
      }

      // Refresh lists
      await fetchAdmins();
      alert("Admin request rejected successfully!");
    } catch (error) {
      console.error("Error rejecting admin:", error);
      alert("Failed to reject admin");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold">Manage Admins</h1>
          </div>
          <span className="text-sm text-slate-400">👑 Super Admin</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Management</h2>
          <p className="text-slate-400">Review and approve admin registration requests</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-white/10">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 px-4 text-sm font-medium transition ${
              activeTab === "pending"
                ? "border-b-2 border-purple-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Pending Requests ({pendingAdmins.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-4 px-4 text-sm font-medium transition ${
              activeTab === "all"
                ? "border-b-2 border-purple-500 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Admins ({admins.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-slate-400">Loading...</div>
          </div>
        ) : (
          <>
            {activeTab === "pending" && (
              <div className="space-y-4">
                {pendingAdmins.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-slate-400">No pending admin requests</p>
                  </div>
                ) : (
                  pendingAdmins.map((admin) => (
                    <div
                      key={admin.id}
                      className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-6 hover:border-yellow-500/50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{admin.name}</h3>
                            <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-300">
                              Pending Approval
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-slate-400">
                            <p>Email: {admin.email}</p>
                            <p>Username: {admin.username}</p>
                            <p>Requested: {formatDate(admin.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(admin.id)}
                            className="rounded-xl bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleReject(admin.id)}
                            className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "all" && (
              <div className="space-y-4">
                {admins.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                    <p className="text-slate-400">No approved admins</p>
                  </div>
                ) : (
                  admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{admin.name}</h3>
                            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300">
                              Active
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-slate-400">
                            <p>Email: {admin.email}</p>
                            <p>Username: {admin.username}</p>
                            <p>Approved: {formatDate(admin.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
