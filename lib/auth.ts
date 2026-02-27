import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createClient();
  const { data } = await supabase.from("profiles").select("id, role, created_at").eq("id", user.id).single<Profile>();

  return data ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

export async function requireRole(role: Role) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login");
  if (profile.role !== role) {
    redirect(profile.role === "restaurant" ? "/restaurant" : "/waiter");
  }
  return profile;
}

export async function redirectByRole() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/auth/login");
  }

  redirect(profile.role === "restaurant" ? "/restaurant" : "/waiter");
}
