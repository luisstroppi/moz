import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { getEnv } from "@/lib/env";

export function createClient() {
  const cookieStore = cookies();
  const { url, anon } = getEnv();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        // En Server Components Next.js no permite mutar cookies.
        // Supabase puede intentar refrescar sesión; en ese contexto ignoramos el set.
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // No-op intencional.
        }
      }
    }
  });
}
