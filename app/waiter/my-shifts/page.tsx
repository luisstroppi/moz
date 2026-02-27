import { NavPortal } from "@/components/nav";
import { Caja, ChipEstado, StarRatingField, Stars, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { rateRestaurant, withdrawApplication } from "@/app/waiter/actions";

type ShiftLite = {
  id: string;
  title: string;
  status: string;
  restaurant_id: string;
  start_at: string;
  end_at: string;
  restaurants: { name: string | null } | { name: string | null }[] | null;
};

type RestaurantToWaiterRating = {
  shift_id: string;
  score: number;
  comment: string | null;
};

export default async function MyShiftsPage() {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const [{ data: apps }, { data: myRatings }, { data: ratingsToMe }] = await Promise.all([
    supabase
      .from("applications")
      .select("id, status, shift_id, shifts(id, title, status, start_at, end_at, restaurant_id, restaurants(name))")
      .eq("waiter_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase.from("ratings").select("shift_id").eq("rater_id", profile.id).eq("rater_role", "waiter"),
    supabase
      .from("ratings")
      .select("shift_id, score, comment")
      .eq("rater_role", "restaurant")
      .eq("ratee_role", "waiter")
      .eq("ratee_id", profile.id)
  ]);

  const ratedShiftIds = new Set((myRatings ?? []).map((r) => r.shift_id));
  const ratingByShift = new Map((ratingsToMe as RestaurantToWaiterRating[] | null)?.map((r) => [r.shift_id, r]) ?? []);
  const averageToMe =
    ratingsToMe && ratingsToMe.length ? ratingsToMe.reduce((acc, curr) => acc + curr.score, 0) / ratingsToMe.length : null;

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
          {apps?.map((app) => {
            const shiftRaw = app.shifts as ShiftLite | ShiftLite[] | null;
            const shift = Array.isArray(shiftRaw) ? shiftRaw[0] ?? null : shiftRaw;

            if (!shift) {
              return (
                <li key={app.id} className="rounded-lg border border-amber-300 bg-amber-50 p-3">
                  <p className="font-medium">Turno {app.shift_id}</p>
                  <p className="text-sm text-slate-700">Postulación: {app.status}</p>
                  <p className="text-sm text-slate-700">
                    El turno existe, pero no se pudo cargar su detalle. Aplicá en Supabase la migración
                    `202602270003_waiter_shift_visibility.sql`.
                  </p>
                </li>
              );
            }

            const restaurantRaw = shift.restaurants;
            const restaurant = Array.isArray(restaurantRaw) ? restaurantRaw[0] ?? null : restaurantRaw;
            const review = ratingByShift.get(shift.id);

            return (
              <li key={app.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{shift.title}</p>
                  <ChipEstado estado={shift.status} />
                </div>
                <p className="text-sm text-slate-600">Restaurante: {restaurant?.name || "Sin nombre"}</p>
                <p className="text-sm text-slate-600">Postulación: {app.status}</p>
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

                {app.status === "applied" && (
                  <form action={withdrawApplication} className="mt-3">
                    <input type="hidden" name="shift_id" value={shift.id} />
                    <button type="submit" className="bg-rose-700">
                      Cancelar postulación
                    </button>
                  </form>
                )}

                {shift.status === "completed" && app.status === "hired" && !ratedShiftIds.has(shift.id) && (
                  <form action={rateRestaurant} className="mt-3 space-y-2">
                    <input type="hidden" name="shift_id" value={shift.id} />
                    <input type="hidden" name="restaurant_id" value={shift.restaurant_id} />
                    <StarRatingField name="score" idPrefix={`rate-${shift.id}`} />
                    <textarea name="comment" rows={2} placeholder="Comentario" />
                    <button type="submit">Calificar restaurante</button>
                  </form>
                )}

                {shift.status === "completed" && app.status === "hired" && ratedShiftIds.has(shift.id) && (
                  <p className="mt-3 text-sm font-medium text-[#154C52]">Ya calificaste este turno.</p>
                )}
              </li>
            );
          })}
          {!apps?.length && <li className="text-sm text-slate-500">Todavía no te postulaste a turnos.</li>}
        </ul>
      </Caja>
    </div>
  );
}
