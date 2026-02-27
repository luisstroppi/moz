import { createBrowserClient } from "@supabase/ssr";
import { getEnv } from "@/lib/env";

export function createClient() {
  const { url, anon } = getEnv();
  return createBrowserClient(url, anon);
}
