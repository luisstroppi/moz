import { NavPortal } from "@/components/nav";
import { Caja, ChipEstado, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { rateRestaurant } from "@/app/waiter/actions";

export default async function MyShiftsPage() {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const [{ data: apps }, { data: myRatings }] = await Promise.all([
    supabase
      .from("applications")
      .select("id, status, shift_id, shifts(id, title, status, start_at, end_at, restaurant_id, restaurants(name))")
      .eq("waiter_id", profile.id)
      .order("created_at", { ascending: false }),
    supabase.from("ratings").select("shift_id").eq("rater_id", profile.id)
  ]);

  const ratedShiftIds = new Set((myRatings ?? []).map((r) => r.shift_id));

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
        <Subtitulo>Postulados / Contratados / Completados</Subtitulo>
        <ul className="mt-3 space-y-3">
          {apps?.map((app) => {
            const shift = app.shifts as {
              id: string;
              title: string;
              status: string;
              restaurant_id: string;
              restaurants: { name: string | null } | null;
            } | null;

            if (!shift) return null;

            return (
              <li key={app.id} className="rounded-lg border border-slate-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{shift.title}</p>
                  <ChipEstado estado={shift.status} />
                </div>
                <p className="text-sm text-slate-600">Restaurante: {shift.restaurants?.name || "Sin nombre"}</p>
                <p className="text-sm text-slate-600">Postulación: {app.status}</p>

                {shift.status === "completed" && app.status === "hired" && !ratedShiftIds.has(shift.id) && (
                  <form action={rateRestaurant} className="mt-3 space-y-2">
                    <input type="hidden" name="shift_id" value={shift.id} />
                    <input type="hidden" name="restaurant_id" value={shift.restaurant_id} />
                    <input name="score" type="number" min={1} max={5} defaultValue={5} required />
                    <textarea name="comment" rows={2} placeholder="Comentario" />
                    <button type="submit">Calificar restaurante</button>
                  </form>
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
