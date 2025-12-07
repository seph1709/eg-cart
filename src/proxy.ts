import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    const currentPathname = request.nextUrl.pathname;
    if (currentPathname === "/") {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    console.log(request.cookies);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string) {
            request.cookies.set({ name, value });
          },
          remove(name: string) {
            request.cookies.set({ name, value: "" });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user);

    if (!user) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    return response;
  } catch (e) {
    console.log(e);

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/"],
};
