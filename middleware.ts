import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoures = createRouteMatcher([
  "/",
  "/upcoming",
  "previous",
  "/recordings",
  "/personal_room",
  "/meeting(.*)",
]);
export default clerkMiddleware((auth, req) => {
  if (protectedRoures(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
