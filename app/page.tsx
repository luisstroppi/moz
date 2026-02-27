import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="bg-slate-950 text-white">
      <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 md:px-10 md:pt-14">
        <div className="pointer-events-none absolute -left-20 top-10 h-60 w-60 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between">
            <p className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-300">
              MOZ
            </p>
            <Link
              href="/auth/login"
              className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-white/20"
            >
              {user ? "Ir al portal" : "Iniciar sesión"}
            </Link>
          </div>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Contratá mozos por turno,
                <span className="text-amber-300"> en minutos.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-slate-200 sm:text-lg">
                MOZ conecta restaurantes que necesitan cubrir turnos con mozos disponibles. Publicá, postulate,
                contratá y calificá todo desde una sola plataforma.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/auth/signup?role=restaurant"
                  className="rounded-xl bg-amber-400 px-5 py-3 text-center text-sm font-bold text-slate-900 no-underline"
                >
                  Soy restaurante
                </Link>
                <Link
                  href="/auth/signup?role=waiter"
                  className="rounded-xl border border-white/40 bg-transparent px-5 py-3 text-center text-sm font-bold text-white no-underline"
                >
                  Soy mozo
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
              <p className="text-sm font-semibold text-amber-200">Cómo funciona</p>
              <div className="mt-4 space-y-3">
                <article className="rounded-xl border border-white/15 bg-slate-900/40 p-4">
                  <p className="text-sm font-semibold">1. El restaurante publica un turno</p>
                  <p className="mt-1 text-sm text-slate-300">Define fecha, horario y requisitos.</p>
                </article>
                <article className="rounded-xl border border-white/15 bg-slate-900/40 p-4">
                  <p className="text-sm font-semibold">2. Los mozos se postulan</p>
                  <p className="mt-1 text-sm text-slate-300">Se postulan desde el panel en segundos.</p>
                </article>
                <article className="rounded-xl border border-white/15 bg-slate-900/40 p-4">
                  <p className="text-sm font-semibold">3. Se contrata y se califica</p>
                  <p className="mt-1 text-sm text-slate-300">Ambas partes dejan calificación tras completar.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 text-slate-900 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold sm:text-3xl">Beneficios para cada parte</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold">Para restaurantes</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Cubrí ausencias y picos de demanda rápido.</li>
                <li>Filtrá postulantes por perfil y experiencia.</li>
                <li>Guardá instructivos para onboarding express.</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-lg font-semibold">Para mozos</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Encontrá turnos abiertos con filtros simples.</li>
                <li>Construí reputación con calificaciones reales.</li>
                <li>Recibí propinas con link y QR personal.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-12 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
          <h2 className="text-2xl font-bold sm:text-3xl">¿Listo para empezar?</h2>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">Creá tu cuenta y publicá o encontrá tu próximo turno hoy.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup?role=restaurant"
              className="rounded-xl bg-amber-400 px-5 py-3 text-center text-sm font-bold text-slate-900 no-underline"
            >
              Crear cuenta restaurante
            </Link>
            <Link
              href="/auth/signup?role=waiter"
              className="rounded-xl border border-white/30 px-5 py-3 text-center text-sm font-bold text-white no-underline"
            >
              Crear cuenta mozo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
