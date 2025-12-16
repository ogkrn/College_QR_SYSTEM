"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Student = {
  id: string;
  name: string;
  rollNumber: string | null;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to view students");
      setIsLoading(false);
      return;
    }

    fetch("http://localhost:4000/students", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch students");
        setStudents(data.students);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">College QR Portal</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">👥 Registered Students</h2>
          <p className="text-slate-400 text-sm">List of all verified students in the system</p>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading students...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">{error}</p>
            <Link href="/login" className="mt-4 inline-block text-sm text-purple-400 hover:underline">
              Go to Login
            </Link>
          </div>
        ) : students.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-slate-400">No registered students found.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Roll Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-white">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{student.rollNumber || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-slate-500">
          Total: {students.length} student{students.length !== 1 ? "s" : ""}
        </div>
      </main>
    </div>
  );
}
