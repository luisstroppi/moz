"use server";

import { createClient as createServerClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";

export async function createTipAction(formData: FormData) {
  const waiterId = String(formData.get("waiter_id") ?? "");
  const amount = Number(formData.get("amount") ?? "0");
  const message = String(formData.get("message") ?? "").trim();

  if (!waiterId || Number.isNaN(amount) || amount <= 0) {
    return { ok: false, error: "Datos inválidos" };
  }

  const { url, anon } = getEnv();
  const supabase = createServerClient(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { error } = await supabase.from("tips").insert({
    waiter_id: waiterId,
    amount,
    message: message || null
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
