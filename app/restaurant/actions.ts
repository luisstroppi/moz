"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

const WAITER_ROLES = ["mozo", "runner", "bacha", "cafetero", "mozo_mostrador"] as const;

function normalizeWaiterRole(value: FormDataEntryValue | null): (typeof WAITER_ROLES)[number] | null {
  const role = String(value ?? "").trim();
  if (!role) return null;
  return WAITER_ROLES.includes(role as (typeof WAITER_ROLES)[number]) ? (role as (typeof WAITER_ROLES)[number]) : null;
}

export async function saveRestaurantProfile(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  await supabase.from("restaurants").upsert({
    id: profile.id,
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim()
  });

  revalidatePath("/restaurant");
  redirect("/restaurant");
}

export async function createShift(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  const { error } = await supabase.from("shifts").insert({
    restaurant_id: profile.id,
    title: String(formData.get("title") ?? "").trim(),
    start_at: String(formData.get("start_at")),
    end_at: String(formData.get("end_at")),
    requirements: String(formData.get("requirements") ?? "").trim(),
    waiter_role: normalizeWaiterRole(formData.get("waiter_role"))
  });

  if (error) {
    redirect("/restaurant/shifts/new?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/restaurant");
  redirect("/restaurant");
}

export async function createInstruction(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();
  const kind = String(formData.get("kind") ?? "company").trim() === "role" ? "role" : "company";
  const waiterRole = normalizeWaiterRole(formData.get("waiter_role"));

  await supabase.from("instructions").insert({
    restaurant_id: profile.id,
    title: String(formData.get("title") ?? "").trim(),
    youtube_url: String(formData.get("youtube_url") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim() || null,
    kind,
    waiter_role: kind === "role" ? waiterRole : null
  });

  revalidatePath("/restaurant/instructions");
}

export async function deleteInstruction(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();
  const id = String(formData.get("instruction_id") ?? "");

  await supabase.from("instructions").delete().eq("id", id).eq("restaurant_id", profile.id);
  revalidatePath("/restaurant/instructions");
}

export async function hireWaiter(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();
  const shiftId = String(formData.get("shift_id") ?? "");
  const waiterId = String(formData.get("waiter_id") ?? "");

  const { data: shift } = await supabase
    .from("shifts")
    .select("id, restaurant_id")
    .eq("id", shiftId)
    .eq("restaurant_id", profile.id)
    .single();

  if (!shift) return;

  await supabase
    .from("applications")
    .update({ status: "rejected" })
    .eq("shift_id", shiftId)
    .neq("waiter_id", waiterId)
    .eq("status", "applied");

  await supabase.from("applications").update({ status: "hired" }).eq("shift_id", shiftId).eq("waiter_id", waiterId);

  await supabase
    .from("shifts")
    .update({ status: "contracted", hired_waiter_id: waiterId })
    .eq("id", shiftId)
    .eq("restaurant_id", profile.id);

  revalidatePath(`/restaurant/shifts/${shiftId}`);
  revalidatePath("/restaurant");
}

export async function completeShift(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();
  const shiftId = String(formData.get("shift_id") ?? "");

  await supabase.from("shifts").update({ status: "completed" }).eq("id", shiftId).eq("restaurant_id", profile.id);

  revalidatePath(`/restaurant/shifts/${shiftId}`);
  revalidatePath("/restaurant");
}

export async function deleteShift(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();
  const shiftId = String(formData.get("shift_id") ?? "");

  await supabase.from("shifts").delete().eq("id", shiftId).eq("restaurant_id", profile.id);

  revalidatePath("/restaurant");
  redirect("/restaurant");
}

export async function rateWaiter(formData: FormData) {
  const profile = await requireRole("restaurant");
  const supabase = createClient();

  const shiftId = String(formData.get("shift_id") ?? "");
  const waiterId = String(formData.get("waiter_id") ?? "");

  await supabase.from("ratings").insert({
    shift_id: shiftId,
    rater_role: "restaurant",
    rater_id: profile.id,
    ratee_role: "waiter",
    ratee_id: waiterId,
    score: Number(formData.get("score") ?? 5),
    comment: String(formData.get("comment") ?? "").trim() || null
  });

  revalidatePath(`/restaurant/shifts/${shiftId}`);
}
