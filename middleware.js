import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/communities(.*)",
  "/n/(.*)",
  "/search(.*)",
  "/profile/(.*)",
  "/profile-setup(.*)",
  "/bookmarks(.*)",
  "/api/votes(.*)",
  "/api/bookmarks(.*)",
  "/api/sync-user(.*)",
  "/api/profile(.*)",
  "/api/comments(.*)",
  "/api/posts(.*)",
  "/api/communities(.*)",
  "/api/delete(.*)"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};