import Link from "next/link";
import { NavPortal } from "@/components/nav";
import { BannerPerfil, Caja, ChipEstado, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type RestaurantLite = { name: string | null };

function perfilCompleto(waiter: { full_name: string | null; phone: string | null; city: string | null }) {
  return Boolean(waiter?.full_name && waiter?.phone && waiter?.city);
}

export default async function WaiterDashboard({
  searchParams
}: {
  searchParams: { date?: string; restaurant?: string; role?: string };
}) {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const dateFilter = searchParams.date;
  const restaurantFilter = searchParams.restaurant;
  const roleFilter = searchParams.role;

  let shiftsQuery = supabase
    .from("shifts")
    .select("id, title, start_at, end_at, requirements, status, waiter_role, restaurants(name)")
    .eq("status", "open")
    .order("start_at", { ascending: true });

  if (dateFilter) {
    shiftsQuery = shiftsQuery.gte("start_at", `${dateFilter}T00:00:00`).lte("start_at", `${dateFilter}T23:59:59`);
  }
  if (roleFilter) {
    shiftsQuery = shiftsQuery.eq("waiter_role", roleFilter);
  }

  const [{ data: waiter }, { data: shifts }] = await Promise.all([
    supabase.from("waiters").select("full_name, phone, city").eq("id", profile.id).single(),
    shiftsQuery
  ]);

  const shiftsFiltrados =
    restaurantFilter && shifts
      ? shifts.filter((shift) => {
          const restRaw = shift.restaurants as RestaurantLite | RestaurantLite[] | null;
          const rest = Array.isArray(restRaw) ? restRaw[0] ?? null : restRaw;
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
        <form className="mt-3 grid gap-3 md:grid-cols-4">
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
          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium">
              Puesto
            </label>
            <select id="role" name="role" defaultValue={roleFilter}>
              <option value="">Todos</option>
              <option value="mozo">Mozo</option>
              <option value="runner">Runner</option>
              <option value="bacha">Bacha</option>
              <option value="cafetero">Cafetero</option>
              <option value="mozo_mostrador">Mozo de mostrador</option>
            </select>
          </div>
          <div className="self-end">
            <button type="submit" className="w-full">
              Filtrar
            </button>
          </div>
        </form>

        <ul className="mt-4 space-y-3">
          {shiftsFiltrados?.map((shift) => {
            const restRaw = shift.restaurants as RestaurantLite | RestaurantLite[] | null;
            const rest = Array.isArray(restRaw) ? restRaw[0] ?? null : restRaw;
            return (
              <li key={shift.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium">{shift.title}</p>
                  <ChipEstado estado={shift.status} />
                </div>
                <p className="text-sm text-slate-600">Restaurante: {rest?.name || "Sin nombre"}</p>
                <p className="text-sm text-slate-600">Puesto: {labelRol(shift.waiter_role)}</p>
                <p className="text-sm text-slate-600">
                  {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Ver y postularme</span>
                  <Link
                    href={`/waiter/shifts/${shift.id}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primario text-white no-underline"
                    aria-label={`Ver y postularme al turno ${shift.title}`}
                  >
                    &#8250;
                  </Link>
                </div>
              </li>
            );
          })}
          {!shiftsFiltrados?.length && <li className="text-sm text-slate-500">No hay turnos para estos filtros.</li>}
        </ul>
      </Caja>
    </div>
  );
}

function labelRol(value: string | null) {
  const map: Record<string, string> = {
    mozo: "Mozo",
    runner: "Runner",
    bacha: "Bacha",
    cafetero: "Cafetero",
    mozo_mostrador: "Mozo de mostrador"
  };
  if (!value) return "Sin definir";
  return map[value] ?? value;
}
