import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  // By default, all routes are protected.
  // We list the routes that should be accessible to everyone (public).
  publicRoutes: [
    '/',
    '/channel/(.*)', // Allow all individual channel pages
    '/api/channel(.*)', // Allow the public API for fetching channel data
  ],
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
