import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const isAuthRoute = pathname.startsWith("/auth");
  const isRestaurantRoute = pathname.startsWith("/restaurant");
  const isWaiterRoute = pathname.startsWith("/waiter");

  if ((isRestaurantRoute || isWaiterRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user && (isRestaurantRoute || isWaiterRoute || isAuthRoute)) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single<{ role: "restaurant" | "waiter" }>();

    if (!profile) {
      if (isAuthRoute && pathname.startsWith("/auth/signup")) return response;
      const url = request.nextUrl.clone();
      url.pathname = "/auth/signup";
      return NextResponse.redirect(url);
    }

    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = profile.role === "restaurant" ? "/restaurant" : "/waiter";
      return NextResponse.redirect(url);
    }

    if (isRestaurantRoute && profile.role !== "restaurant") {
      const url = request.nextUrl.clone();
      url.pathname = "/waiter";
      return NextResponse.redirect(url);
    }

    if (isWaiterRoute && profile.role !== "waiter") {
      const url = request.nextUrl.clone();
      url.pathname = "/restaurant";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/auth/:path*", "/restaurant/:path*", "/waiter/:path*"]
};
