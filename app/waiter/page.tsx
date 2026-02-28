import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function WaiterHomePage() {
  const profile = await requireRole("waiter");
  const supabase = createClient();
  const { data: waiter } = await supabase.from("waiters").select("full_name, city").eq("id", profile.id).single();

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-x-hidden bg-gradient-to-b from-[#ffd6e7] via-[#ffb4d0] to-[#ff8bb7] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-md rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.65)]">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff006e]">PedidosYa Rider</p>
            <h1 className="text-3xl font-black text-slate-900">Start working</h1>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fff0f7] text-[#ff006e]">✕</span>
        </header>

        <p className="text-sm text-slate-600">{waiter?.full_name ? `${waiter.full_name}${waiter.city ? ` · ${waiter.city}` : ""}` : "Configura tu perfil para empezar"}</p>

        <section className="mt-5 border-t border-slate-200 pt-4">
          <h2 className="text-xl font-bold text-slate-900">Tipo de sesión</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <OptionCard title="Bike" subtitle="Turnos rápidos" icon="🚲" />
            <OptionCard title="Car" subtitle="Cobertura amplia" icon="🚗" active />
            <OptionCard title="Moto" subtitle="Alta demanda" icon="🛵" />
            <OptionCard title="Runner" subtitle="Eventos" icon="🏃" />
          </div>
        </section>

        <section className="mt-6 border-t border-slate-200 pt-4">
          <h2 className="text-xl font-bold text-slate-900">Opciones</h2>
          <div className="mt-3 space-y-3">
            <Link
              href="/waiter/mozo"
              className="flex items-center gap-3 rounded-2xl border border-[#ffd1e3] bg-[#fff1f8] p-4 text-[#c40056] no-underline transition hover:bg-[#ffe6f2]"
            >
              <HandTrayIcon />
              <div>
                <p className="text-base font-bold">Modo Mozo</p>
                <p className="text-sm font-medium text-slate-600">Abrir vista de mozos actual</p>
              </div>
            </Link>

            <Link href="/waiter/my-shifts" className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline">
              Mis turnos
            </Link>
            <Link href="/waiter/tips" className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline">
              Propinas
            </Link>
            <Link href="/waiter/profile" className="block rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 no-underline">
              Perfil
            </Link>
          </div>
        </section>

        <button type="button" className="mt-7 w-full rounded-2xl bg-slate-950 py-3 text-lg font-bold text-white">
          Start
        </button>
      </div>
    </div>
  );
}

function OptionCard({ title, subtitle, icon, active = false }: { title: string; subtitle: string; icon: string; active?: boolean }) {
  return (
    <article
      className={`rounded-2xl border p-3 text-center ${
        active ? "border-[#ffd1e3] bg-[#ffeef6] text-[#c40056]" : "border-slate-200 bg-white text-slate-800"
      }`}
    >
      <p className="text-2xl">{icon}</p>
      <p className="mt-1 text-lg font-bold">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </article>
  );
}

function HandTrayIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M3.5 13.5h5.2c.3 0 .7.1.9.3l1.6 1.2h4.6c.9 0 1.7.8 1.7 1.7s-.8 1.8-1.7 1.8h-5.9l-2.4-1.8"
        stroke="#c40056"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.3 13.5V8.9a2 2 0 0 1 4 0v2.5" stroke="#c40056" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10.5 11.4V8.5a2 2 0 0 1 4 0v2.9" stroke="#c40056" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M13.8 11.8V9.6a1.9 1.9 0 1 1 3.8 0v3.9" stroke="#c40056" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5 20h14" stroke="#ff006e" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.5 6.5h11a2.5 2.5 0 0 0-5-1 3 3 0 0 0-6 .5c0 .2 0 .3 0 .5Z" stroke="#ff006e" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
