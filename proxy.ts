import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@/lib/server"

export async function proxy(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // ❌ не авторизован
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single()

  const role = userData?.role
  
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin")
  const isCashierPage = request.nextUrl.pathname.startsWith("/cashier")

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