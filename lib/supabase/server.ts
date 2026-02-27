import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getEnv } from "@/lib/env";

export function createClient() {
  const cookieStore = cookies();
  const { url, anon } = getEnv();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}
