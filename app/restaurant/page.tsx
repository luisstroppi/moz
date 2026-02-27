import Link from "next/link";
import { NavPortal } from "@/components/nav";
import { BannerPerfil, Caja, ChipEstado, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function perfilCompleto(restaurant: { name: string | null; address: string | null; phone: string | null }) {
  return Boolean(restaurant?.name && restaurant?.address && restaurant?.phone);
}

export default async function RestaurantDashboard() {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  const [{ data: restaurant }, { data: shifts }] = await Promise.all([
    supabase.from("restaurants").select("name, address, phone").eq("id", profile.id).single(),
    supabase
      .from("shifts")
      .select("id, title, start_at, end_at, status, applications(count)")
      .eq("restaurant_id", profile.id)
      .order("start_at", { ascending: true })
  ]);

  return (
    <div>
      <NavPortal
        titulo="Portal Restaurante"
        links={[
          { href: "/restaurant", label: "Dashboard" },
          { href: "/restaurant/profile", label: "Perfil" },
          { href: "/restaurant/shifts/new", label: "Publicar turno" },
          { href: "/restaurant/instructions", label: "Instructivos" }
        ]}
      />

      {!perfilCompleto(restaurant ?? { name: null, address: null, phone: null }) && (
        <BannerPerfil texto="Completá tu perfil para generar más confianza en los mozos." href="/restaurant/profile" />
      )}

      <Caja>
        <div className="mb-4 flex items-center justify-between">
          <Subtitulo>Próximos turnos</Subtitulo>
          <Link href="/restaurant/shifts/new" className="rounded-lg bg-primario px-4 py-2 text-sm font-medium text-white no-underline">
            Publicar turno
          </Link>
        </div>

        <ul className="space-y-3">
          {shifts?.map((shift) => (
            <li key={shift.id} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="font-medium">{shift.title}</p>
                <ChipEstado estado={shift.status} />
              </div>
              <p className="text-sm text-slate-600">
                {new Date(shift.start_at).toLocaleString("es-AR")} - {new Date(shift.end_at).toLocaleString("es-AR")}
              </p>
              <p className="text-sm text-slate-600">Postulaciones: {(shift.applications as unknown as { count: number }[])[0]?.count ?? 0}</p>
              <Link href={`/restaurant/shifts/${shift.id}`} className="mt-2 inline-block text-sm">
                Ver detalle
              </Link>
            </li>
          ))}

          {!shifts?.length && <li className="text-sm text-slate-500">Todavía no publicaste turnos.</li>}
        </ul>
      </Caja>
    </div>
  );
}
