import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] min-h-screen w-screen overflow-x-hidden bg-white text-slate-900">
      <header className="border-b border-[#f5c3d9] bg-white/90 px-6 py-4 backdrop-blur sm:px-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff006e] text-base font-extrabold text-white">PY</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ff006e]">PedidosYa</p>
              <p className="text-sm font-semibold text-slate-800">Operaciones</p>
            </div>
          </div>
          <Link
            href={user ? "/auth/login" : "/auth/login"}
            className="rounded-xl bg-[#ff006e] px-5 py-2 text-sm font-semibold text-white no-underline transition hover:bg-[#e60063]"
          >
            {user ? "Entrar al portal" : "Iniciar sesión"}
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#fff2f8] via-white to-[#ffe8f2] px-6 py-14 sm:px-10 md:py-16">
        <div className="pointer-events-none absolute -left-28 top-12 h-72 w-72 rounded-full bg-[#ff006e]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-[#ff8fbc]/25 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff006e]">Landing de servicio</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              Centro de operaciones para restaurantes en red PedidosYa
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-700 sm:text-lg">
              Gestiona pedidos, turnos y cobertura de mozos desde una sola home. Esta es la nueva puerta de entrada
              operativa con branding PedidosYa.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/signup?role=restaurant"
                className="rounded-xl bg-[#ff006e] px-6 py-3 text-center text-sm font-semibold text-white no-underline"
              >
                Crear restaurante
              </Link>
              <Link
                href="/auth/signup?role=waiter"
                className="rounded-xl border border-[#ff006e]/35 bg-white px-6 py-3 text-center text-sm font-semibold text-[#c40056] no-underline"
              >
                Crear perfil de mozo
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-[#ffd0e3] bg-white p-6 shadow-[0_20px_45px_-30px_rgba(255,0,110,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#ff006e]">Módulos operativos</p>
            <ul className="mt-4 space-y-3">
              <li className="rounded-2xl border border-[#ffe0ed] bg-[#fff5fa] p-4 text-sm font-medium text-slate-800">Procesamiento de pedidos en tiempo real</li>
              <li className="rounded-2xl border border-[#ffe0ed] bg-[#fff5fa] p-4 text-sm font-medium text-slate-800">Gestión de turnos y dotación de mozos</li>
              <li className="rounded-2xl border border-[#ffe0ed] bg-[#fff5fa] p-4 text-sm font-medium text-slate-800">Métricas de operación y desempeño del local</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
