import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mảng các routes cần bảo vệ
const protectedRoutes = ['/dashboard', '/settings', '/marketplace']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/admin-login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasAccessToken = request.cookies.has('access_token')
  const hasRefreshToken = request.cookies.has('refresh_token')

  const isAuthenticated = hasAccessToken || hasRefreshToken

  // Nếu truy cập protected routes nhưng chưa đăng nhập -> chuyển hướng về login
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Nếu truy cập admin routes (/admin hoặc /admin/...) nhưng chưa đăng nhập -> chuyển hướng về admin-login
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  if (!isAuthenticated && isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin-login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Chú ý: Ở Edge middleware, chúng ta không thể gọi DB để check role Admin.
  // Việc kiểm tra role Admin thực sự sẽ được thực hiện ở Backend (API call) và Client side (useAuthStore).
  // Middleware chỉ đảm bảo đã có token.

  // Nếu truy cập auth routes nhưng ĐÃ đăng nhập -> chuyển hướng về dashboard
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Cấu hình các path mà middleware sẽ chạy
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/marketplace/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/admin-login',
  ],
}
