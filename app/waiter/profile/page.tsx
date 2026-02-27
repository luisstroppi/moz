import { NavPortal } from "@/components/nav";
import { Caja, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { saveWaiterProfile } from "@/app/waiter/actions";

export default async function WaiterProfilePage() {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const [{ data }, { data: givenRatings }, { data: receivedRatings }] = await Promise.all([
    supabase
      .from("waiters")
      .select("full_name, phone, city, bio, experience, preferred_areas, photo_url")
      .eq("id", profile.id)
      .single(),
    supabase
      .from("ratings")
      .select("id, score, comment, created_at, ratee_id")
      .eq("rater_id", profile.id)
      .eq("rater_role", "waiter")
      .eq("ratee_role", "restaurant")
      .order("created_at", { ascending: false }),
    supabase
      .from("ratings")
      .select("id, score, comment, created_at, rater_id")
      .eq("ratee_id", profile.id)
      .eq("ratee_role", "waiter")
      .order("created_at", { ascending: false })
  ]);

  const restIds = Array.from(
    new Set([...(givenRatings ?? []).map((r) => r.ratee_id), ...(receivedRatings ?? []).map((r) => r.rater_id)])
  );
  const { data: restaurants } = restIds.length
    ? await supabase.from("restaurants").select("id, name").in("id", restIds)
    : { data: [] as { id: string; name: string | null }[] };
  const restNames = new Map((restaurants ?? []).map((r) => [r.id, r.name || "Restaurante"]));

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

      <Caja>
        <Subtitulo>Mis reseñas recibidas</Subtitulo>
        <ul className="mt-3 space-y-3">
          {(receivedRatings ?? []).map((rating) => (
            <li key={rating.id} className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium">Desde: {restNames.get(rating.rater_id) ?? "Restaurante"}</p>
              <p className="text-sm text-slate-600">Puntaje: {rating.score}/5</p>
              {rating.comment && <p className="text-sm text-slate-700">{rating.comment}</p>}
            </li>
          ))}
          {!receivedRatings?.length && <li className="text-sm text-slate-500">Aún no recibiste reseñas.</li>}
        </ul>
      </Caja>

      <Caja>
        <Subtitulo>Reseñas que dejé</Subtitulo>
        <ul className="mt-3 space-y-3">
          {(givenRatings ?? []).map((rating) => (
            <li key={rating.id} className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-medium">Para: {restNames.get(rating.ratee_id) ?? "Restaurante"}</p>
              <p className="text-sm text-slate-600">Puntaje: {rating.score}/5</p>
              {rating.comment && <p className="text-sm text-slate-700">{rating.comment}</p>}
            </li>
          ))}
          {!givenRatings?.length && <li className="text-sm text-slate-500">Todavía no dejaste reseñas.</li>}
        </ul>
      </Caja>
    </div>
  );
}
