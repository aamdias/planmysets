import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isInternalRoute = createRouteMatcher(['/workout(.*)']);

export default clerkMiddleware((auth, req) => {
 // Restrict dashboard routes to signed in users
 if (isInternalRoute(req)) auth().protect();

});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};