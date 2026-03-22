import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

const staleStatePattern = "State not found";

export const GET = async (request: Request) => {
  const response = (await handleAuth(
    request,
    "kinde_callback",
  )) as unknown as Response;

  if (response.status !== 500) {
    return response;
  }

  const body = await response.clone().text();
  if (!body.includes(staleStatePattern)) {
    return response;
  }

  const loginUrl = new URL("/login?reason=session-expired", request.url);
  return NextResponse.redirect(loginUrl);
};
