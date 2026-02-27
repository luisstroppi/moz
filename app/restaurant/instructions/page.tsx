import { NavPortal } from "@/components/nav";
import { Caja, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createInstruction, deleteInstruction } from "@/app/restaurant/actions";

export default async function InstructionsPage() {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  const { data: instructions } = await supabase
    .from("instructions")
    .select("id, title, youtube_url, notes, kind, waiter_role")
    .eq("restaurant_id", profile.id)
    .order("created_at", { ascending: false });

  const companyInstructions = (instructions ?? []).filter((item) => item.kind !== "role");
  const roleInstructions = (instructions ?? []).filter((item) => item.kind === "role");

  const roleLabel: Record<string, string> = {
    mozo: "Mozo",
    runner: "Runner",
    bacha: "Bacha",
    cafetero: "Cafetero",
    mozo_mostrador: "Mozo de mostrador"
  };

  return (
    <div>
      <NavPortal
        titulo="Instructivos"
        links={[
          { href: "/restaurant", label: "Dashboard" },
          { href: "/restaurant/profile", label: "Perfil" },
          { href: "/restaurant/shifts/new", label: "Publicar turno" },
          { href: "/restaurant/instructions", label: "Instructivos" }
        ]}
      />

      <Caja>
        <Subtitulo>Agregar instructivo</Subtitulo>
        <form action={createInstruction} className="mt-4 space-y-3">
          <div>
            <label htmlFor="kind" className="mb-1 block text-sm font-medium">
              Tipo
            </label>
            <select id="kind" name="kind" defaultValue="company">
              <option value="company">Políticas y cultura del restaurante</option>
              <option value="role">Capacitación por puesto</option>
            </select>
          </div>
          <div>
            <label htmlFor="waiter_role" className="mb-1 block text-sm font-medium">
              Puesto (si es capacitación por puesto)
            </label>
            <select id="waiter_role" name="waiter_role" defaultValue="mozo">
              <option value="mozo">Mozo</option>
              <option value="runner">Runner</option>
              <option value="bacha">Bacha</option>
              <option value="cafetero">Cafetero</option>
              <option value="mozo_mostrador">Mozo de mostrador</option>
            </select>
          </div>
          <input name="title" placeholder="Título" required />
          <input name="youtube_url" placeholder="URL de YouTube" required />
          <textarea name="notes" rows={3} placeholder="Notas opcionales" />
          <button type="submit">Guardar instructivo</button>
        </form>
      </Caja>

      <Caja>
        <Subtitulo>Políticas y cultura</Subtitulo>
        <ul className="mt-3 space-y-3">
          {companyInstructions.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium">{item.title}</p>
              <a href={item.youtube_url} target="_blank" rel="noreferrer" className="text-sm text-slate-700">
                Ver video
              </a>
              {item.notes && <p className="mt-2 text-sm text-slate-600">{item.notes}</p>}
              <form action={deleteInstruction} className="mt-2">
                <input type="hidden" name="instruction_id" value={item.id} />
                <button type="submit" className="bg-rose-600">
                  Eliminar
                </button>
              </form>
            </li>
          ))}
          {!companyInstructions.length && <li className="text-sm text-slate-500">Todavía no cargaste instructivos de políticas.</li>}
        </ul>
      </Caja>

      <Caja>
        <Subtitulo>Capacitación por puesto</Subtitulo>
        <ul className="mt-3 space-y-3">
          {roleInstructions.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {roleLabel[item.waiter_role ?? ""] ?? "Puesto general"}
              </p>
              <a href={item.youtube_url} target="_blank" rel="noreferrer" className="text-sm text-slate-700">
                Ver video
              </a>
              {item.notes && <p className="mt-2 text-sm text-slate-600">{item.notes}</p>}
              <form action={deleteInstruction} className="mt-2">
                <input type="hidden" name="instruction_id" value={item.id} />
                <button type="submit" className="bg-rose-600">
                  Eliminar
                </button>
              </form>
            </li>
          ))}
          {!roleInstructions.length && <li className="text-sm text-slate-500">Todavía no cargaste instructivos por puesto.</li>}
        </ul>
      </Caja>
    </div>
  );
}
