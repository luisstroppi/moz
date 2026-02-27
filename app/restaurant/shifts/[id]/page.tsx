import { NavPortal } from "@/components/nav";
import { Caja, ChipEstado, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { completeShift, hireWaiter, rateWaiter } from "@/app/restaurant/actions";

type WaiterBasico = {
  full_name: string | null;
  city: string | null;
  experience: string | null;
};

export default async function ShiftDetailRestaurantPage({
  params
}: {
  params: { id: string };
}) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  const [{ data: shift }, { data: apps }, { data: rating }] = await Promise.all([
    supabase
      .from("shifts")
      .select("id, title, start_at, end_at, requirements, status, waiter_role, hired_waiter_id")
      .eq("id", params.id)
      .eq("restaurant_id", profile.id)
      .single(),
    supabase
      .from("applications")
      .select("id, waiter_id, status, waiters(full_name, city, experience)")
      .eq("shift_id", params.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("ratings")
      .select("id")
      .eq("shift_id", params.id)
      .eq("rater_id", profile.id)
      .maybeSingle()
  ]);

  if (!shift) {
    return <p>Turno no encontrado.</p>;
  }

  return (
    <div>
      <NavPortal
        titulo="Detalle del turno"
        links={[
          { href: "/restaurant", label: "Dashboard" },
          { href: "/restaurant/profile", label: "Perfil" },
          { href: "/restaurant/shifts/new", label: "Publicar turno" },
          { href: "/restaurant/instructions", label: "Instructivos" }
        ]}
      />

      <Caja>
        <div className="mb-3 flex items-center justify-between">
          <Subtitulo>{shift.title}</Subtitulo>
          <ChipEstado estado={shift.status} />
        </div>
        <p className="text-sm text-slate-600">
          {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
        </p>
        <p className="text-sm text-slate-600">Puesto: {labelRol(shift.waiter_role)}</p>
        <p className="mt-2 text-sm">{shift.requirements || "Sin requisitos específicos."}</p>

        {shift.status === "contracted" && (
          <form action={completeShift} className="mt-4">
            <input type="hidden" name="shift_id" value={shift.id} />
            <button type="submit">Marcar turno como completado</button>
          </form>
        )}
      </Caja>

      <Caja>
        <Subtitulo>Postulantes</Subtitulo>
        <ul className="mt-3 space-y-3">
          {apps?.map((app) => {
            const waitersRaw = app.waiters as WaiterBasico | WaiterBasico[] | null;
            const waiter = Array.isArray(waitersRaw) ? waitersRaw[0] ?? null : waitersRaw;
            return (
              <li key={app.id} className="rounded-lg border border-slate-200 p-3">
                <p className="font-medium">{waiter?.full_name || "Mozo"}</p>
                <p className="text-sm text-slate-600">{waiter?.city || "Sin ciudad"}</p>
                <p className="text-sm text-slate-600">Experiencia: {waiter?.experience || "No especificada"}</p>
                <p className="text-xs text-slate-500">Estado: {app.status}</p>

                {shift.status === "open" && app.status === "applied" && (
                  <form action={hireWaiter} className="mt-2">
                    <input type="hidden" name="shift_id" value={shift.id} />
                    <input type="hidden" name="waiter_id" value={app.waiter_id} />
                    <button type="submit">Contratar este mozo</button>
                  </form>
                )}
              </li>
            );
          })}

          {!apps?.length && <li className="text-sm text-slate-500">Sin postulaciones todavía.</li>}
        </ul>
      </Caja>

      {shift.status === "completed" && shift.hired_waiter_id && !rating && (
        <Caja>
          <Subtitulo>Calificar mozo contratado</Subtitulo>
          <form action={rateWaiter} className="mt-3 space-y-3">
            <input type="hidden" name="shift_id" value={shift.id} />
            <input type="hidden" name="waiter_id" value={shift.hired_waiter_id} />
            <div>
              <label htmlFor="score" className="mb-1 block text-sm font-medium">
                Puntaje (1-5)
              </label>
              <input id="score" name="score" type="number" min={1} max={5} defaultValue={5} required />
            </div>
            <div>
              <label htmlFor="comment" className="mb-1 block text-sm font-medium">
                Comentario
              </label>
              <textarea id="comment" name="comment" rows={3} />
            </div>
            <button type="submit">Enviar calificación</button>
          </form>
        </Caja>
      )}
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
