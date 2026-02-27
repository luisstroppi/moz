import { createClient } from "@/lib/supabase/server";
import { TipForm } from "@/app/tip/[waiterId]/tip-form";

export default async function TipPage({
  params
}: {
  params: { waiterId: string };
}) {
  const supabase = createClient();

  const { data: waiter } = await supabase
    .from("waiters")
    .select("id, full_name, city")
    .eq("id", params.waiterId)
    .maybeSingle();

  if (!waiter) {
    return <p className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-6">Mozo no encontrado.</p>;
  }

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Propina para {waiter.full_name || "mozo"}</h1>
      <p className="mt-1 text-sm text-slate-600">Ciudad: {waiter.city || "No especificada"}</p>
      <p className="mb-4 mt-3 text-sm">Este pago es simulado para MVP. Solo registramos la propina.</p>
      <TipForm waiterId={waiter.id} />
    </div>
  );
}
