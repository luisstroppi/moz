import { NavPortal } from "@/components/nav";
import { Caja, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { saveWaiterProfile } from "@/app/waiter/actions";

export default async function WaiterProfilePage() {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const { data } = await supabase
    .from("waiters")
    .select("full_name, phone, city, bio, experience, preferred_areas, photo_url")
    .eq("id", profile.id)
    .single();

  return (
    <div>
      <NavPortal
        titulo="Perfil de mozo"
        links={[
          { href: "/waiter", label: "Dashboard" },
          { href: "/waiter/profile", label: "Perfil" },
          { href: "/waiter/my-shifts", label: "Mis turnos" },
          { href: "/waiter/tips", label: "Propinas" }
        ]}
      />

      <Caja>
        <Subtitulo>Datos personales</Subtitulo>
        <form action={saveWaiterProfile} className="mt-4 space-y-3">
          <div>
            <label htmlFor="full_name" className="mb-1 block text-sm font-medium">
              Nombre completo
            </label>
            <input id="full_name" name="full_name" defaultValue={data?.full_name ?? ""} required />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Teléfono
            </label>
            <input id="phone" name="phone" defaultValue={data?.phone ?? ""} required />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium">
              Ciudad
            </label>
            <input id="city" name="city" defaultValue={data?.city ?? ""} required />
          </div>
          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium">
              Bio corta
            </label>
            <textarea id="bio" name="bio" rows={3} defaultValue={data?.bio ?? ""} />
          </div>
          <div>
            <label htmlFor="experience" className="mb-1 block text-sm font-medium">
              Experiencia
            </label>
            <textarea id="experience" name="experience" rows={3} defaultValue={data?.experience ?? ""} />
          </div>
          <div>
            <label htmlFor="preferred_areas" className="mb-1 block text-sm font-medium">
              Zonas preferidas
            </label>
            <input id="preferred_areas" name="preferred_areas" defaultValue={data?.preferred_areas ?? ""} />
          </div>
          <div>
            <label htmlFor="photo_url" className="mb-1 block text-sm font-medium">
              URL de foto (opcional)
            </label>
            <input id="photo_url" name="photo_url" defaultValue={data?.photo_url ?? ""} />
          </div>
          <button type="submit">Guardar perfil</button>
        </form>
      </Caja>
    </div>
  );
}
