import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isInternalRoute = createRouteMatcher(['/workout(.*)', '/api/(.*)']);

export default clerkMiddleware((auth, req) => {
  // Add logging to debug
  console.log('Middleware invoked for:', req.url);

  // Restrict dashboard routes to signed in users
  if (isInternalRoute(req)) {
    console.log('Internal route matched:', req.url);
    auth().protect();
  } 
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/workout(.*)', '/api/(.*)'],
};
