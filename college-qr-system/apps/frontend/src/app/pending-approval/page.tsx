"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function PendingApprovalContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "Admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur text-center">
        <div className="mx-auto w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <span className="text-4xl">⏳</span>
        </div>
        
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-yellow-300">Pending Approval</p>
          <h1 className="text-2xl font-bold text-white">Waiting for Super Admin</h1>
        </header>

        <div className="space-y-4 text-slate-300">
          <p>
            Hi <span className="font-semibold text-white">{name}</span>,
          </p>
          <p>
            Your admin registration request has been submitted successfully.
          </p>
          <p className="text-sm text-slate-400">
            Email: <span className="text-white">{email}</span>
          </p>
        </div>

        <div className="rounded-xl bg-slate-800/50 border border-white/10 p-4 text-left space-y-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span>📋</span> What happens next?
          </h3>
          <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside">
            <li>The Super Admin will review your request</li>
            <li>Once approved, you'll be able to login</li>
            <li>You'll have access to the Admin dashboard</li>
          </ol>
        </div>

        <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 text-sm text-blue-200">
          💡 <strong>Tip:</strong> Contact your Super Admin if you need faster approval or have any questions.
        </div>

        <div className="pt-4 space-y-3">
          <Link
            href="/login"
            className="block w-full rounded-2xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90"
          >
            Go to Login
          </Link>
          <p className="text-xs text-slate-500">
            You can try logging in once your account is approved
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Loading...</p>
      </div>
    }>
      <PendingApprovalContent />
    </Suspense>
  );
}
