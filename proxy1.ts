import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/server"

export async function proxy(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const role = user?.user_metadata?.role

  const isAdminPage = request.nextUrl.pathname.startsWith("/admin")
  const isCashierPage = request.nextUrl.pathname.startsWith("/cashier")

  // ❌ не авторизован
  if (!user && (isAdminPage || isCashierPage)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ❌ не админ
  if (isAdminPage && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // ❌ не кассир/админ
  if (isCashierPage && role !== "cashier" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/cashier/:path*"],
}