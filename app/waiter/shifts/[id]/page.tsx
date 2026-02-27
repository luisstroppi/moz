import { NavPortal } from "@/components/nav";
import { Caja, ChipEstado, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { applyToShift, withdrawApplication } from "@/app/waiter/actions";

export default async function ShiftDetailWaiterPage({
  params
}: {
  params: { id: string };
}) {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const [{ data: shift }, { data: application }, { data: instructions }] = await Promise.all([
    supabase
      .from("shifts")
      .select("id, title, start_at, end_at, requirements, status, restaurant_id, restaurants(name, description, address)")
      .eq("id", params.id)
      .single(),
    supabase
      .from("applications")
      .select("id, status")
      .eq("shift_id", params.id)
      .eq("waiter_id", profile.id)
      .maybeSingle(),
    supabase.from("instructions").select("id, title, youtube_url, notes, restaurant_id")
  ]);

  if (!shift) {
    return <p>Turno no encontrado.</p>;
  }

  const restaurant = shift.restaurants as { name: string | null; description: string | null; address: string | null } | null;
  const instructionsForRestaurant = instructions?.filter((item) => item.restaurant_id === shift.restaurant_id) ?? [];

  return (
    <div>
      <NavPortal
        titulo="Detalle del turno"
        links={[
          { href: "/waiter", label: "Dashboard" },
          { href: "/waiter/profile", label: "Perfil" },
          { href: "/waiter/my-shifts", label: "Mis turnos" },
          { href: "/waiter/tips", label: "Propinas" }
        ]}
      />

      <Caja>
        <div className="mb-3 flex items-center justify-between">
          <Subtitulo>{shift.title}</Subtitulo>
          <ChipEstado estado={shift.status} />
        </div>
        <p className="text-sm text-slate-600">Restaurante: {restaurant?.name || "Sin nombre"}</p>
        <p className="text-sm text-slate-600">
          {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
        </p>
        <p className="mt-2 text-sm">{shift.requirements || "Sin requisitos específicos."}</p>

        {!application && shift.status === "open" && (
          <form action={applyToShift} className="mt-4">
            <input type="hidden" name="shift_id" value={shift.id} />
            <button type="submit">Postularme</button>
          </form>
        )}

        {application?.status === "applied" && (
          <form action={withdrawApplication} className="mt-4">
            <input type="hidden" name="shift_id" value={shift.id} />
            <button type="submit" className="bg-rose-600">
              Cancelar postulación
            </button>
          </form>
        )}

        {application && <p className="mt-3 text-sm">Estado de tu postulación: {application.status}</p>}
      </Caja>

      <Caja>
        <Subtitulo>Instructivos del restaurante</Subtitulo>
        <ul className="mt-3 space-y-3">
          {instructionsForRestaurant.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium">{item.title}</p>
              <a href={item.youtube_url} target="_blank" rel="noreferrer" className="text-sm text-slate-700">
                Ver video
              </a>
              {item.notes && <p className="mt-1 text-sm text-slate-600">{item.notes}</p>}
            </li>
          ))}
          {!instructionsForRestaurant.length && <li className="text-sm text-slate-500">Sin instructivos cargados.</li>}
        </ul>
      </Caja>
    </div>
  );
}
