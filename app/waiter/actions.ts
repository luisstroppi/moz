"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function saveWaiterProfile(formData: FormData) {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  await supabase.from("waiters").upsert({
    id: profile.id,
    full_name: String(formData.get("full_name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    experience: String(formData.get("experience") ?? "").trim(),
    preferred_areas: String(formData.get("preferred_areas") ?? "").trim() || null,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null
  });

  revalidatePath("/waiter");
  redirect("/waiter");
}

export async function applyToShift(formData: FormData) {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const shiftId = String(formData.get("shift_id") ?? "");

  await supabase.from("applications").upsert(
    {
      shift_id: shiftId,
      waiter_id: profile.id,
      status: "applied"
    },
    { onConflict: "shift_id,waiter_id" }
  );

  revalidatePath("/waiter");
  revalidatePath(`/waiter/shifts/${shiftId}`);
}

export async function withdrawApplication(formData: FormData) {
  const profile = await requireRole("waiter");
  const supabase = createClient();
  const shiftId = String(formData.get("shift_id") ?? "");

  await supabase
    .from("applications")
    .update({ status: "withdrawn" })
    .eq("shift_id", shiftId)
    .eq("waiter_id", profile.id)
    .eq("status", "applied");

  revalidatePath("/waiter/my-shifts");
  revalidatePath("/waiter");
  revalidatePath(`/waiter/shifts/${shiftId}`);
}

export async function rateRestaurant(formData: FormData) {
  const profile = await requireRole("waiter");
  const supabase = createClient();

  const shiftId = String(formData.get("shift_id") ?? "");
  const restaurantId = String(formData.get("restaurant_id") ?? "");

  await supabase.from("ratings").insert({
    shift_id: shiftId,
    rater_role: "waiter",
    rater_id: profile.id,
    ratee_role: "restaurant",
    ratee_id: restaurantId,
    score: Number(formData.get("score") ?? 5),
    comment: String(formData.get("comment") ?? "").trim() || null
  });

  revalidatePath("/waiter/my-shifts");
  revalidatePath("/waiter");
}
