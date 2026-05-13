import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
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
    "/api/delete(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};