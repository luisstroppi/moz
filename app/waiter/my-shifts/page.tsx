import { NavPortal } from "@/components/nav";
import { Caja, ChipEstado, StarRatingField, Stars, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { rateRestaurant, withdrawApplication } from "@/app/waiter/actions";

type ApplicationLite = {
  id: string;
  status: string;
  shift_id: string;
};

type ShiftRow = {
  id: string;
  title: string;
  status: string;
  restaurant_id: string;
  start_at: string;
  end_at: string;
};

type RestaurantRow = {
  id: string;
  name: string | null;
};

type RestaurantToWaiterRating = {
  shift_id: string;
  score: number;
  comment: string | null;
};

type RenderItem = {
  key: string;
  shift: ShiftRow;
  appStatus: string;
};

export default async function MyShiftsPage() {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const [{ data: appsData }, { data: myRatings }, { data: ratingsToMe }, { data: hiredShiftsData }] = await Promise.all([
    supabase.from("applications").select("id, status, shift_id").eq("waiter_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("ratings").select("shift_id").eq("rater_id", profile.id).eq("rater_role", "waiter"),
    supabase
      .from("ratings")
      .select("shift_id, score, comment")
      .eq("rater_role", "restaurant")
      .eq("ratee_role", "waiter")
      .eq("ratee_id", profile.id),
    supabase
      .from("shifts")
      .select("id, title, status, start_at, end_at, restaurant_id")
      .eq("hired_waiter_id", profile.id)
      .in("status", ["contracted", "completed"])
      .order("start_at", { ascending: false })
  ]);

  const apps = (appsData ?? []) as ApplicationLite[];
  const hiredShifts = (hiredShiftsData ?? []) as ShiftRow[];

  const appShiftIds = Array.from(new Set(apps.map((a) => a.shift_id)));
  const { data: appShiftsData } = appShiftIds.length
    ? await supabase.from("shifts").select("id, title, status, start_at, end_at, restaurant_id").in("id", appShiftIds)
    : { data: [] as ShiftRow[] };
  const appShifts = (appShiftsData ?? []) as ShiftRow[];

  const allShiftsById = new Map<string, ShiftRow>();
  for (const s of appShifts) allShiftsById.set(s.id, s);
  for (const s of hiredShifts) allShiftsById.set(s.id, s);

  const restaurantIds = Array.from(new Set(Array.from(allShiftsById.values()).map((s) => s.restaurant_id)));
  const { data: restaurantsData } = restaurantIds.length
    ? await supabase.from("restaurants").select("id, name").in("id", restaurantIds)
    : { data: [] as RestaurantRow[] };
  const restaurantById = new Map((restaurantsData ?? []).map((r) => [r.id, r.name || "Sin nombre"]));

  const ratedShiftIds = new Set((myRatings ?? []).map((r) => r.shift_id));
  const ratingByShift = new Map((ratingsToMe as RestaurantToWaiterRating[] | null)?.map((r) => [r.shift_id, r]) ?? []);
  const averageToMe =
    ratingsToMe && ratingsToMe.length ? ratingsToMe.reduce((acc, curr) => acc + curr.score, 0) / ratingsToMe.length : null;

  const byShiftId = new Map<string, RenderItem>();
  for (const app of apps) {
    const shift = allShiftsById.get(app.shift_id);
    if (!shift) continue;
    byShiftId.set(shift.id, { key: app.id, shift, appStatus: app.status });
  }
  for (const shift of hiredShifts) {
    if (!byShiftId.has(shift.id)) {
      byShiftId.set(shift.id, { key: `hired-${shift.id}`, shift, appStatus: "hired" });
    }
  }

  const items = Array.from(byShiftId.values()).sort(
    (a, b) => new Date(b.shift.start_at).getTime() - new Date(a.shift.start_at).getTime()
  );

  return (
    <div>
      <NavPortal
        titulo="Mis turnos"
        links={[
          { href: "/waiter", label: "Dashboard" },
          { href: "/waiter/profile", label: "Perfil" },
          { href: "/waiter/my-shifts", label: "Mis turnos" },
          { href: "/waiter/tips", label: "Propinas" }
        ]}
      />

      <Caja>
        <div className="flex items-center justify-between gap-3">
          <Subtitulo>Postulados / Contratados / Completados</Subtitulo>
          <div className="text-sm">
            <span className="mr-2 text-slate-600">Mi promedio:</span>
            <Stars value={averageToMe} />
          </div>
        </div>

        <ul className="mt-3 space-y-3">
          {items.map((item) => {
            const shift = item.shift;
            const review = ratingByShift.get(shift.id);

            return (
              <li key={item.key} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{shift.title}</p>
                  <ChipEstado estado={shift.status} />
                </div>
                <p className="text-sm text-slate-600">Restaurante: {restaurantById.get(shift.restaurant_id) || "Sin nombre"}</p>
                <p className="text-sm text-slate-600">Postulación: {item.appStatus}</p>
                <p className="text-sm text-slate-600">
                  {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
                </p>

                {review && (
                  <div className="mt-3 rounded-lg border border-[#154C52]/20 bg-white p-3">
                    <p className="text-sm font-semibold">Reseña del restaurante</p>
                    <p className="text-sm text-slate-700">
                      Puntaje: <Stars value={review.score} />
                    </p>
                    {review.comment && <p className="text-sm text-slate-700">{review.comment}</p>}
                  </div>
                )}

                {item.appStatus === "applied" && (
                  <form action={withdrawApplication} className="mt-3">
                    <input type="hidden" name="shift_id" value={shift.id} />
                    <button type="submit" className="bg-rose-700">
                      Cancelar postulación
                    </button>
                  </form>
                )}

                {shift.status === "completed" && item.appStatus === "hired" && !ratedShiftIds.has(shift.id) && (
                  <form action={rateRestaurant} className="mt-3 space-y-2">
                    <input type="hidden" name="shift_id" value={shift.id} />
                    <input type="hidden" name="restaurant_id" value={shift.restaurant_id} />
                    <StarRatingField name="score" idPrefix={`rate-${shift.id}`} />
                    <textarea name="comment" rows={2} placeholder="Comentario" />
                    <button type="submit">Calificar restaurante</button>
                  </form>
                )}

                {shift.status === "completed" && item.appStatus === "hired" && ratedShiftIds.has(shift.id) && (
                  <p className="mt-3 text-sm font-medium text-[#154C52]">Ya calificaste este turno.</p>
                )}
              </li>
            );
          })}
          {!items.length && <li className="text-sm text-slate-500">Todavía no te postulaste a turnos.</li>}
        </ul>
      </Caja>
    </div>
  );
}
