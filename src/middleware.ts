import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const currentPathname = request.nextUrl.pathname;
    if (currentPathname === "/") {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    // This `try` block ensures that the middleware doesn't fail
    // and returns a response even if Supabase-related operations fail.
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

    // IMPORTANT: Calling `getUser()` here is crucial. It refreshes the auth token
    // and sets the new cookie on the response. This is more secure than `getSession()`
    // as it makes a network call to the Supabase Auth server.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user);

    // Redirect the user if they are not authenticated and trying to access a protected route
    if (!user) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    // Pass the response to the next middleware or to the next route
    return response;
  } catch (e) {
    // If a redirect happens, the error is likely a redirect exception.
    // In that case, we can simply return the exception.
    // If not, it's an unexpected error, so we can log it and return a new response.

    console.log(e);

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/"],
};
