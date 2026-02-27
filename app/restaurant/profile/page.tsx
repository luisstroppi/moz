import { NavPortal } from "@/components/nav";
import { Caja, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { saveRestaurantProfile } from "@/app/restaurant/actions";

export default async function RestaurantProfilePage() {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  const { data } = await supabase
    .from("restaurants")
    .select("name, address, phone, description")
    .eq("id", profile.id)
    .single();

  return (
    <div>
      <NavPortal
        titulo="Perfil del restaurante"
        links={[
          { href: "/restaurant", label: "Dashboard" },
          { href: "/restaurant/profile", label: "Perfil" },
          { href: "/restaurant/shifts/new", label: "Publicar turno" },
          { href: "/restaurant/instructions", label: "Instructivos" }
        ]}
      />

      <Caja>
        <Subtitulo>Datos del restaurante</Subtitulo>
        <form action={saveRestaurantProfile} className="mt-4 space-y-3">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nombre
            </label>
            <input id="name" name="name" defaultValue={data?.name ?? ""} required />
          </div>
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium">
              Dirección
            </label>
            <input id="address" name="address" defaultValue={data?.address ?? ""} required />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Teléfono
            </label>
            <input id="phone" name="phone" defaultValue={data?.phone ?? ""} required />
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">
              Descripción
            </label>
            <textarea id="description" name="description" rows={4} defaultValue={data?.description ?? ""} />
          </div>
          <button type="submit">Guardar cambios</button>
        </form>
      </Caja>
    </div>
  );
}
