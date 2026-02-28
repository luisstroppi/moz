import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function RestaurantDashboard() {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  const [{ data: restaurant }, { count: shiftsOpen }, { count: shiftsContracted }, { data: shiftsWithApps }] = await Promise.all([
    supabase.from("restaurants").select("name").eq("id", profile.id).single(),
    supabase.from("shifts").select("id", { count: "exact", head: true }).eq("restaurant_id", profile.id).eq("status", "open"),
    supabase.from("shifts").select("id", { count: "exact", head: true }).eq("restaurant_id", profile.id).eq("status", "contracted"),
    supabase.from("shifts").select("id, applications(count)").eq("restaurant_id", profile.id)
  ]);
  const totalApps = (shiftsWithApps ?? []).reduce(
    (acc, shift) => acc + ((shift.applications as unknown as { count: number }[])[0]?.count ?? 0),
    0
  );

  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <div className="grid min-h-screen grid-cols-1 bg-[#f7f7f7] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-slate-200 bg-white p-5">
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff006e] text-base font-black text-white">PY</span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff006e]">PedidosYa</p>
              <p className="text-xl font-black text-slate-900">Portal</p>
            </div>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Monitoreo</p>
          <nav className="space-y-1">
            <span className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#fff2f8] hover:text-[#cc0058]">
              Procesamiento de pedidos
            </span>
            <span className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#fff2f8] hover:text-[#cc0058]">
              Tablero
            </span>
            <span className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-[#fff2f8] hover:text-[#cc0058]">
              Reportes
            </span>
          </nav>

          <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Operaciones</p>
          <nav className="space-y-2">
            <Link
              href="/restaurant/operations"
              className="block rounded-xl border border-[#ffd3e5] bg-[#fff2f8] px-3 py-2 text-sm font-semibold text-[#c40056] no-underline"
            >
              Ir a operaciones
            </Link>
            <Link href="/restaurant/shifts/new" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-slate-100">
              Publicar turno
            </Link>
            <Link href="/restaurant/instructions" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-slate-100">
              Instructivos
            </Link>
            <Link href="/restaurant/profile" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700 no-underline hover:bg-slate-100">
              Perfil del local
            </Link>
          </nav>
        </aside>

        <main className="p-6 sm:p-8">
          <header className="rounded-2xl border border-[#ffd6e7] bg-[#fff2f8] p-4">
            <p className="text-sm text-slate-600">Bienvenido</p>
            <h1 className="text-3xl font-black text-slate-900">Landing de Operaciones PedidosYa</h1>
            <p className="mt-2 text-slate-700">
              {restaurant?.name ? `Local: ${restaurant.name}` : "Completá tu local"} | Operá pedidos y turnos desde una misma entrada.
            </p>
          </header>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Pedidos nuevos</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{shiftsOpen ?? 0}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Pedidos aceptados</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{shiftsContracted ?? 0}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Postulaciones</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{totalApps ?? 0}</p>
            </article>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-black text-slate-900">Procesamiento de pedidos</h2>
              <p className="mt-2 text-slate-600">Visualiza y gestiona todos tus pedidos y turnos en tiempo real.</p>
              <Link
                href="/restaurant/operations"
                className="mt-6 inline-flex rounded-xl bg-[#ff006e] px-5 py-3 text-sm font-semibold text-white no-underline"
              >
                Abrir aplicación de restaurantes
              </Link>
            </article>
            <article className="rounded-3xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-black text-slate-900">Operación del local</h2>
              <p className="mt-2 text-slate-600">Configura perfil, instructivos y nuevos turnos desde el portal.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/restaurant/profile" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 no-underline">
                  Perfil
                </Link>
                <Link href="/restaurant/shifts/new" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 no-underline">
                  Turnos
                </Link>
                <Link href="/restaurant/instructions" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 no-underline">
                  Instructivos
                </Link>
              </div>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
