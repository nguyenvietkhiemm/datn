import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách URL muốn bảo vệ
const protectedRoutes = [
  "/flashcards/:id",
  "/profile/:id",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // lấy token từ cookie

  const url = req.nextUrl.clone();

  // Kiểm tra xem request có nằm trong protected route
  const isProtected = protectedRoutes.some(route => {
    // Simple check với dynamic route
    if (route.includes(":id")) {
      const base = route.split("/:id")[0];
      return req.nextUrl.pathname.startsWith(base);
    }
    return req.nextUrl.pathname === route;
  });

  if (!token && isProtected) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/flashcards/:id", "/profile/:id"]
};
