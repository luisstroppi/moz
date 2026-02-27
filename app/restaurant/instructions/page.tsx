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
    .select("id, title, youtube_url, notes")
    .eq("restaurant_id", profile.id)
    .order("created_at", { ascending: false });

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
          <input name="title" placeholder="Título" required />
          <input name="youtube_url" placeholder="URL de YouTube" required />
          <textarea name="notes" rows={3} placeholder="Notas opcionales" />
          <button type="submit">Guardar instructivo</button>
        </form>
      </Caja>

      <Caja>
        <Subtitulo>Instructivos cargados</Subtitulo>
        <ul className="mt-3 space-y-3">
          {instructions?.map((item) => (
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
          {!instructions?.length && <li className="text-sm text-slate-500">Todavía no cargaste instructivos.</li>}
        </ul>
      </Caja>
    </div>
  );
}
