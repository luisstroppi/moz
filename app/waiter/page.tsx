import Link from "next/link";
import { NavPortal } from "@/components/nav";
import { BannerPerfil, Caja, ChipEstado, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function perfilCompleto(waiter: { full_name: string | null; phone: string | null; city: string | null }) {
  return Boolean(waiter?.full_name && waiter?.phone && waiter?.city);
}

export default async function WaiterDashboard({
  searchParams
}: {
  searchParams: { date?: string; restaurant?: string };
}) {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const dateFilter = searchParams.date;
  const restaurantFilter = searchParams.restaurant;

  let shiftsQuery = supabase
    .from("shifts")
    .select("id, title, start_at, end_at, requirements, status, restaurants(name)")
    .eq("status", "open")
    .order("start_at", { ascending: true });

  if (dateFilter) {
    shiftsQuery = shiftsQuery.gte("start_at", `${dateFilter}T00:00:00`).lte("start_at", `${dateFilter}T23:59:59`);
  }

  const [{ data: waiter }, { data: shifts }] = await Promise.all([
    supabase.from("waiters").select("full_name, phone, city").eq("id", profile.id).single(),
    shiftsQuery
  ]);

  const shiftsFiltrados =
    restaurantFilter && shifts
      ? shifts.filter((shift) => {
          const rest = shift.restaurants as { name: string | null } | null;
          return (rest?.name ?? "").toLowerCase().includes(restaurantFilter.toLowerCase());
        })
      : shifts;

  return (
    <div>
      <NavPortal
        titulo="Portal Mozo"
        links={[
          { href: "/waiter", label: "Dashboard" },
          { href: "/waiter/profile", label: "Perfil" },
          { href: "/waiter/my-shifts", label: "Mis turnos" },
          { href: "/waiter/tips", label: "Propinas" }
        ]}
      />

      {!perfilCompleto(waiter ?? { full_name: null, phone: null, city: null }) && (
        <BannerPerfil texto="Completá tu perfil para tener más chances de contratación." href="/waiter/profile" />
      )}

      <Caja>
        <Subtitulo>Buscar turnos disponibles</Subtitulo>
        <form className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium">
              Fecha
            </label>
            <input id="date" name="date" type="date" defaultValue={dateFilter} />
          </div>
          <div>
            <label htmlFor="restaurant" className="mb-1 block text-sm font-medium">
              Restaurante
            </label>
            <input id="restaurant" name="restaurant" defaultValue={restaurantFilter} placeholder="Nombre" />
          </div>
          <div className="self-end">
            <button type="submit" className="w-full">
              Filtrar
            </button>
          </div>
        </form>

        <ul className="mt-4 space-y-3">
          {shiftsFiltrados?.map((shift) => {
            const rest = shift.restaurants as { name: string | null } | null;
            return (
              <li key={shift.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium">{shift.title}</p>
                  <ChipEstado estado={shift.status} />
                </div>
                <p className="text-sm text-slate-600">Restaurante: {rest?.name || "Sin nombre"}</p>
                <p className="text-sm text-slate-600">
                  {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
                </p>
                <Link href={`/waiter/shifts/${shift.id}`} className="mt-2 inline-block text-sm">
                  Ver y postularme
                </Link>
              </li>
            );
          })}
          {!shiftsFiltrados?.length && <li className="text-sm text-slate-500">No hay turnos para estos filtros.</li>}
        </ul>
      </Caja>
    </div>
  );
}
