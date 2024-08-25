import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are protected
const isProtectedRoute = createRouteMatcher([
  "/",  // Example: home page is protected
  // Add other protected routes here
]);

// Define which routes are public (accessible without auth)
const isPublicRoute = createRouteMatcher([
  "/water",  // Example: public page
  // Add other public routes here
]);

export default clerkMiddleware((auth, request) => {
  // If the route is public, skip auth
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // If the route is protected, enforce auth
  if (isProtectedRoute(request)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
