import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are protected and require a signed-in user
const isProtectedRoute = createRouteMatcher([
  '/api/history(.*)', // Protect our new history API route
]);

export default clerkMiddleware((auth, req) => {
  // For protected routes, enforce authentication if the user is not signed in
  if (isProtectedRoute(req)) {
    auth.protect(); // CORRECTED: No parentheses on auth
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
