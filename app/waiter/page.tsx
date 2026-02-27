import { NavPortal } from "@/components/nav";
import { BannerPerfil, Caja, ChevronCircleLink, ChipEstado, Stars, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { withdrawApplication } from "@/app/waiter/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ShiftOpen = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  status: string;
  waiter_role: string | null;
  restaurant_id: string;
};

type ApplicationLite = {
  id: string;
  status: string;
  shift_id: string;
};

type ShiftLite = {
  id: string;
  title: string;
  status: string;
  start_at: string;
  end_at: string;
  restaurant_id: string;
};

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
    .select("id, title, start_at, end_at, status, waiter_role, restaurant_id")
    .eq("status", "open")
    .order("start_at", { ascending: true });

  if (dateFilter) {
    shiftsQuery = shiftsQuery.gte("start_at", `${dateFilter}T00:00:00`).lte("start_at", `${dateFilter}T23:59:59`);
  }
  if (roleFilter) {
    shiftsQuery = shiftsQuery.eq("waiter_role", roleFilter);
  }

  const [{ data: waiter }, { data: shiftsOpen }, { data: myAppsRaw }] = await Promise.all([
    supabase.from("waiters").select("full_name, phone, city").eq("id", profile.id).single(),
    shiftsQuery,
    supabase.from("applications").select("id, status, shift_id").eq("waiter_id", profile.id).order("created_at", { ascending: false })
  ]);

  const myApps = (myAppsRaw ?? []) as ApplicationLite[];
  const appByShift = new Map(myApps.map((a) => [a.shift_id, a.status]));

  const shifts = (shiftsOpen ?? []) as ShiftOpen[];
  const openRestaurantIds = Array.from(new Set(shifts.map((s) => s.restaurant_id)));
  const { data: openRestaurants } = openRestaurantIds.length
    ? await supabase.from("restaurants").select("id, name").in("id", openRestaurantIds)
    : { data: [] as { id: string; name: string | null }[] };
  const openRestaurantById = new Map((openRestaurants ?? []).map((r) => [r.id, r.name || "Sin nombre"]));

  const shiftsFiltrados =
    restaurantFilter && shifts.length
      ? shifts.filter((shift) => (openRestaurantById.get(shift.restaurant_id) ?? "").toLowerCase().includes(restaurantFilter.toLowerCase()))
      : shifts;

  const { data: restaurantRatings } = openRestaurantIds.length
    ? await supabase.from("ratings").select("ratee_id, score").eq("ratee_role", "restaurant").in("ratee_id", openRestaurantIds)
    : { data: [] as { ratee_id: string; score: number }[] };

  const restaurantAvg = new Map<string, number>();
  for (const rid of openRestaurantIds) {
    const rows = (restaurantRatings ?? []).filter((r) => r.ratee_id === rid);
    if (!rows.length) continue;
    restaurantAvg.set(
      rid,
      rows.reduce((acc, curr) => acc + curr.score, 0) / rows.length
    );
  }

  const appShiftIds = Array.from(new Set(myApps.map((a) => a.shift_id)));
  const { data: appShiftsData } = appShiftIds.length
    ? await supabase.from("shifts").select("id, title, status, start_at, end_at, restaurant_id").in("id", appShiftIds)
    : { data: [] as ShiftLite[] };
  const appShifts = (appShiftsData ?? []) as ShiftLite[];
  const appRestaurantIds = Array.from(new Set(appShifts.map((s) => s.restaurant_id)));
  const { data: appRestaurants } = appRestaurantIds.length
    ? await supabase.from("restaurants").select("id, name").in("id", appRestaurantIds)
    : { data: [] as { id: string; name: string | null }[] };
  const appRestaurantById = new Map((appRestaurants ?? []).map((r) => [r.id, r.name || "Sin nombre"]));

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
        <Subtitulo>Mis postulaciones (estado actual)</Subtitulo>
        <ul className="mt-3 space-y-3">
          {appShifts.map((shift) => {
            const appStatus = appByShift.get(shift.id) ?? "hired";
            return (
              <li key={shift.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium">{shift.title}</p>
                  <ChipEstado estado={shift.status} />
                </div>
                <p className="text-sm text-slate-600">Restaurante: {appRestaurantById.get(shift.restaurant_id) || "Sin nombre"}</p>
                <p className="text-sm text-slate-600">Postulación: {appStatus}</p>
                <p className="text-sm text-slate-600">
                  {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
                </p>
                {appStatus === "applied" && (
                  <form action={withdrawApplication} className="mt-3">
                    <input type="hidden" name="shift_id" value={shift.id} />
                    <button type="submit" className="bg-rose-700">
                      Cancelar postulación
                    </button>
                  </form>
                )}
              </li>
            );
          })}
          {!appShifts.length && <li className="text-sm text-slate-500">Todavía no te postulaste a turnos.</li>}
        </ul>
      </Caja>

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
          {shiftsFiltrados.map((shift) => {
            const myStatus = appByShift.get(shift.id);
            return (
              <li key={shift.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium">{shift.title}</p>
                  <ChipEstado estado={shift.status} />
                </div>
                <p className="text-sm text-slate-600">Restaurante: {openRestaurantById.get(shift.restaurant_id) || "Sin nombre"}</p>
                <p className="text-sm text-slate-600">
                  Calificación restaurante: <Stars value={restaurantAvg.get(shift.restaurant_id) ?? null} />
                </p>
                <p className="text-sm text-slate-600">Puesto: {labelRol(shift.waiter_role)}</p>
                <p className="text-sm text-slate-600">
                  {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
                </p>
                {myStatus && <p className="mt-1 text-sm font-medium text-[#5E1F1F]">Ya postulaste: {myStatus}</p>}
                <div className="mt-3 flex justify-end">
                  <ChevronCircleLink href={`/waiter/shifts/${shift.id}`} label={`Ver turno ${shift.title}`} />
                </div>
              </li>
            );
          })}
          {!shiftsFiltrados.length && <li className="text-sm text-slate-500">No hay turnos para estos filtros.</li>}
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
