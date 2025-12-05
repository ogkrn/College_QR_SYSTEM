import Link from "next/link";

const cards = [
  {
    title: "Student Access",
    description:
      "Dynamic QR codes, attendance analytics, and outing approvals directly on the phone.",
  },
  {
    title: "Guard Workflow",
    description: "Instant gate validations, logged scans, and live status of student outings.",
  },
  {
    title: "Admin Oversight",
    description: "Role-based controls, password resets, and real-time activity dashboards from one portal.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:px-0">
        <section className="space-y-6 rounded-3xl bg-linear-to-br from-indigo-600 to-slate-900 p-10 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-purple-200">College QR Code System</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            One portal for students, guards, and admins.
          </h1>
          <p className="max-w-2xl text-lg text-slate-200">
            Secure access control, attendance, and outing management converge in this unified web app. Register or
            login with the correct role to enter the control center or display your dynamic QR ID.
          </p>
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/register"
              className="rounded-full bg-white px-6 py-2 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-white/30 px-6 py-2 font-semibold text-white transition hover:border-white"
            >
              Login
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="mt-3 text-sm text-slate-200">{card.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
