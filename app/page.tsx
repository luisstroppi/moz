import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#154C52]/30 bg-[#154C52] text-[#FDF9E8] shadow-xl">
      <section className="relative px-6 pb-14 pt-8 sm:px-10 md:px-14 md:pt-10">
        <div className="pointer-events-none absolute -left-32 -top-20 h-80 w-80 rounded-full bg-[#F0CD1B]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#5E1F1F]/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-10 flex items-center justify-between">
            <p className="rounded-full border border-[#FDF9E8]/35 px-4 py-1 text-xs uppercase tracking-[0.22em] text-[#FDF9E8]/90">
              Moz by Giunti
            </p>
            <Link
              href="/auth/login"
              className="rounded-xl border border-[#5E1F1F] bg-[#5E1F1F] px-5 py-2 text-sm font-semibold text-[#FDF9E8] no-underline hover:opacity-90"
            >
              {user ? "Ir al portal" : "Iniciar sesión"}
            </Link>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#F0CD1B]">Cobertura por turnos</p>
              <h1 className="mt-4 max-w-2xl text-5xl font-black leading-[0.96] text-[#FDF9E8] sm:text-6xl md:text-7xl">
                Contratá mozos por turno
                <span className="text-[#F0CD1B]"> en minutos.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#FDF9E8]/88">
                Moz by Giunti conecta restaurantes que necesitan cubrir turnos con mozos disponibles. Publicá,
                postulate, contratá y calificá desde una sola plataforma.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/auth/signup?role=restaurant"
                  className="rounded-xl bg-[#5E1F1F] px-6 py-3 text-center text-sm font-bold text-[#FDF9E8] no-underline"
                >
                  Soy restaurante
                </Link>
                <Link
                  href="/auth/signup?role=waiter"
                  className="rounded-xl border border-[#FDF9E8]/60 px-6 py-3 text-center text-sm font-bold text-[#FDF9E8] no-underline"
                >
                  Soy mozo
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[#FDF9E8]/30 bg-[#FDF9E8] p-5 text-slate-900 shadow-lg sm:p-6">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#154C52]">Cómo funciona</p>
              <div className="mt-4 space-y-3">
                <article className="rounded-2xl border border-[#154C52]/20 bg-[#FDF9E8] p-4">
                  <p className="text-sm font-bold">1. El restaurante publica un turno</p>
                  <p className="mt-1 text-sm text-slate-700">Define fecha, horario, puesto y requisitos.</p>
                </article>
                <article className="rounded-2xl border border-[#154C52]/20 bg-[#FDF9E8] p-4">
                  <p className="text-sm font-bold">2. Los mozos se postulan</p>
                  <p className="mt-1 text-sm text-slate-700">Se postulan desde el panel en segundos.</p>
                </article>
                <article className="rounded-2xl border border-[#154C52]/20 bg-[#FDF9E8] p-4">
                  <p className="text-sm font-bold">3. Se contrata y se califica</p>
                  <p className="mt-1 text-sm text-slate-700">Ambas partes dejan reseña tras completar.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FDF9E8] px-6 py-12 text-slate-900 sm:px-10 md:px-14">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-[#154C52]/20 bg-white p-6">
            <h2 className="text-xl font-bold text-[#154C52]">Para restaurantes</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Cubrí ausencias y picos de demanda rápido.</li>
              <li>Definí rol por turno: mozo, runner, bacha, cafetero o mostrador.</li>
              <li>Armá instructivos por políticas y por puesto.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[#154C52]/20 bg-white p-6">
            <h2 className="text-xl font-bold text-[#154C52]">Para mozos</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>Encontrá turnos por fecha, restaurante y puesto.</li>
              <li>Construí reputación con reseñas reales.</li>
              <li>Recibí propinas con link y QR personal.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
