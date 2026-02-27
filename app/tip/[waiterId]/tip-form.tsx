"use client";

import { useState } from "react";
import { createTipAction } from "@/app/tip/actions";

export function TipForm({ waiterId }: { waiterId: string }) {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      action={async (formData) => {
        setMensaje(null);
        setError(null);
        const result = await createTipAction(formData);
        if (result.ok) {
          setMensaje("Gracias por tu propina.");
        } else {
          setError(result.error || "No se pudo registrar la propina.");
        }
      }}
    >
      <input type="hidden" name="waiter_id" value={waiterId} />

      <div>
        <label htmlFor="amount" className="mb-1 block text-sm font-medium">
          Monto
        </label>
        <input id="amount" name="amount" type="number" min={1} step="0.01" required placeholder="Ej: 1500" />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium">
          Mensaje (opcional)
        </label>
        <textarea id="message" name="message" rows={3} placeholder="Gracias por la atención" />
      </div>

      <button type="submit">Dejar propina</button>

      {mensaje && <p className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">{mensaje}</p>}
      {error && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}
    </form>
  );
}
