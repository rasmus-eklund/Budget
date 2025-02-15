import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default withAuth(async function middleware() {}, {
  publicPaths: ["/"],
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
