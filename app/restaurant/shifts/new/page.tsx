import { NavPortal } from "@/components/nav";
import { Caja, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createShift } from "@/app/restaurant/actions";

export default async function NewShiftPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  await requireRole("restaurant");

  return (
    <div>
      <NavPortal
        titulo="Publicar turno"
        links={[
          { href: "/restaurant", label: "Dashboard" },
          { href: "/restaurant/profile", label: "Perfil" },
          { href: "/restaurant/shifts/new", label: "Publicar turno" },
          { href: "/restaurant/instructions", label: "Instructivos" }
        ]}
      />

      <Caja>
        <Subtitulo>Nuevo turno</Subtitulo>
        {searchParams.error && <p className="mt-3 rounded-lg bg-[#fff0f7] p-2 text-sm text-[#c40056]">{searchParams.error}</p>}
        <form action={createShift} className="mt-4 space-y-3">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Título
            </label>
            <input id="title" name="title" required placeholder="Ej: Turno noche viernes" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label htmlFor="waiter_role" className="mb-1 block text-sm font-medium">
                Puesto solicitado
              </label>
              <select id="waiter_role" name="waiter_role" required defaultValue="mozo">
                <option value="mozo">Mozo</option>
                <option value="runner">Runner</option>
                <option value="bacha">Bacha</option>
                <option value="cafetero">Cafetero</option>
                <option value="mozo_mostrador">Mozo de mostrador</option>
              </select>
            </div>
            <div>
              <label htmlFor="start_at" className="mb-1 block text-sm font-medium">
                Inicio
              </label>
              <input id="start_at" name="start_at" type="datetime-local" required />
            </div>
            <div>
              <label htmlFor="end_at" className="mb-1 block text-sm font-medium">
                Fin
              </label>
              <input id="end_at" name="end_at" type="datetime-local" required />
            </div>
          </div>
          <div>
            <label htmlFor="requirements" className="mb-1 block text-sm font-medium">
              Requisitos
            </label>
            <textarea id="requirements" name="requirements" rows={4} placeholder="Experiencia, uniforme, disponibilidad..." />
          </div>
          <button type="submit">Publicar turno</button>
        </form>
      </Caja>
    </div>
  );
}
