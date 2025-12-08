"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam.toLowerCase());
    } else {
      router.push("/register");
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("Verifying OTP...");

    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      // Mock success
      setStatus("Email verified successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }, 800);
  }

  function handleResendOTP() {
    if (!canResend) return;

    setIsLoading(true);
    setStatus("Resending OTP...");

    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      setCountdown(180);
      setCanResend(false);
      setStatus("New OTP sent to your email!");
      setIsLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }, 800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-3xl bg-white/5 p-8 shadow-2xl backdrop-blur">
        <header className="space-y-1">
          <p className="text-sm uppercase tracking-[0.4em] text-purple-300">Verify Email</p>
          <h1 className="text-3xl font-bold text-white">Enter Verification Code</h1>
          <p className="text-sm text-slate-400">
            We've sent a 6-digit code to <span className="font-semibold text-white">{email}</span>
          </p>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-200">
            Verification Code
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900/60 px-3 py-2 text-center text-2xl font-bold tracking-widest text-white outline-none transition focus:border-purple-400"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
              placeholder="000000"
              maxLength={6}
            />
          </label>

          <div className="flex items-center justify-between text-sm">
            <div className={`${countdown > 0 ? "text-slate-400" : "text-red-400"}`}>
              {countdown > 0 ? (
                <>Expires in: {formatTime(countdown)}</>
              ) : (
                <>Code expired</>
              )}
            </div>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={!canResend || isLoading}
              className={`font-semibold transition ${
                canResend && !isLoading
                  ? "text-purple-400 hover:text-purple-300"
                  : "text-slate-600 cursor-not-allowed"
              }`}
            >
              Resend Code
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {status && (
          <p
            className={`text-center text-sm ${
              status.includes("success") ? "text-emerald-300" : "text-slate-300"
            }`}
          >
            {status}
          </p>
        )}

        <p className="text-center text-sm text-slate-400">
          Didn't receive the code? Check your spam folder or{" "}
          <Link className="font-semibold text-white transition hover:text-purple-300" href="/register">
            try registering again
          </Link>
        </p>
      </div>
    </div>
  );
}
