import QRCode from "qrcode";
import { NavPortal } from "@/components/nav";
import { Caja, Subtitulo } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function WaiterTipsPage() {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const [{ data: tips }, { data: waiter }] = await Promise.all([
    supabase.from("tips").select("id, amount, message, created_at").eq("waiter_id", profile.id).order("created_at", { ascending: false }),
    supabase.from("waiters").select("full_name").eq("id", profile.id).single()
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const tipLink = `${baseUrl}/tip/${profile.id}`;
  const qrDataUrl = await QRCode.toDataURL(tipLink);

  return (
    <div>
      <NavPortal
        titulo="Propinas"
        links={[
          { href: "/waiter", label: "Dashboard" },
          { href: "/waiter/profile", label: "Perfil" },
          { href: "/waiter/my-shifts", label: "Mis turnos" },
          { href: "/waiter/tips", label: "Propinas" }
        ]}
      />

      <Caja>
        <Subtitulo>Tu link de propina</Subtitulo>
        <p className="mt-2 text-sm">Compartilo con tus clientes:</p>
        <a href={tipLink} target="_blank" rel="noreferrer" className="block break-all text-sm">
          {tipLink}
        </a>
        <img src={qrDataUrl} alt="QR de propina" className="mt-4 h-48 w-48 rounded-lg border border-slate-200 p-2" />
      </Caja>

      <Caja>
        <Subtitulo>Historial de propinas {waiter?.full_name ? `de ${waiter.full_name}` : ""}</Subtitulo>
        <ul className="mt-3 space-y-3">
          {tips?.map((tip) => (
            <li key={tip.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-medium">${Number(tip.amount).toFixed(2)}</p>
              {tip.message && <p className="text-sm text-slate-600">"{tip.message}"</p>}
              <p className="text-xs text-slate-500">{new Date(tip.created_at).toLocaleString("es-AR")}</p>
            </li>
          ))}
          {!tips?.length && <li className="text-sm text-slate-500">Aún no recibiste propinas.</li>}
        </ul>
      </Caja>
    </div>
  );
}
