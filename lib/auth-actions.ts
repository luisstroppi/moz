"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const role = String(formData.get("role") ?? "") as Role;

  if (!email || !password || !["restaurant", "waiter"].includes(role)) {
    redirect("/auth/signup?error=Datos inválidos&role=" + role);
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    redirect("/auth/signup?error=" + encodeURIComponent(error?.message ?? "No se pudo crear la cuenta") + "&role=" + role);
  }

  await supabase.from("profiles").upsert({ id: data.user.id, role });

  if (role === "restaurant") {
    await supabase.from("restaurants").upsert({ id: data.user.id });
    redirect("/restaurant");
  }

  await supabase.from("waiters").upsert({ id: data.user.id });
  redirect("/waiter");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/auth/login?error=" + encodeURIComponent(error.message));
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single<{ role: Role }>();

  if (!profile) {
    redirect("/auth/signup?error=" + encodeURIComponent("Tu cuenta no tiene perfil. Seleccioná un rol para continuar."));
  }

  redirect(profile.role === "restaurant" ? "/restaurant" : "/waiter");
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
