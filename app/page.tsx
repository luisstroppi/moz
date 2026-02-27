import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white">
        <p className="text-sm uppercase tracking-wider text-amber-300">MOZ</p>
        <h1 className="mt-2 text-4xl font-bold">Contratá mozos por turno, en minutos.</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-100">
          MOZ conecta restaurantes que necesitan cubrir turnos con mozos disponibles. Publicá, postulate,
          contratá y calificá todo desde una sola plataforma.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/auth/signup?role=restaurant" className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-900 no-underline">
            Soy restaurante
          </Link>
          <Link href="/auth/signup?role=waiter" className="rounded-lg border border-white px-4 py-2 text-white no-underline">
            Soy mozo
          </Link>
          {user ? (
            <Link href="/auth/login" className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-900 no-underline">
              Ir al portal
            </Link>
          ) : (
            <Link href="/auth/login" className="rounded-lg bg-white px-4 py-2 font-semibold text-slate-900 no-underline">
              Iniciar sesión
            </Link>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">1. Publicá turnos</h2>
          <p className="text-sm text-slate-600">Restaurantes publican fecha, horario y requisitos del turno.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">2. Mozos se postulan</h2>
          <p className="text-sm text-slate-600">Los mozos exploran y aplican con un clic desde su panel.</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-2 text-lg font-semibold">3. Contratá y calificá</h2>
          <p className="text-sm text-slate-600">Al terminar, ambas partes se califican para construir confianza.</p>
        </article>
      </section>
    </div>
  );
}
