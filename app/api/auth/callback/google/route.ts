import { NextRequest, NextResponse } from "next/server";
import { createSession, findOrCreateUser } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_SECRET!;
const GOOGLE_REDIRECT_URI = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  let callbackUrl = "/dashboard";
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString());
      callbackUrl = decoded.callbackUrl || "/dashboard";
    } catch {}
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      console.error("Token error:", tokens);
      return NextResponse.redirect(new URL("/?error=token_error", request.url));
    }

    // Get user info
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    const userInfo = await userInfoResponse.json();

    if (!userInfo.email) {
      return NextResponse.redirect(new URL("/?error=no_email", request.url));
    }

    // Check if this is a new user
    const existingUser = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });
    const isNewUser = !existingUser;

    // Find or create user
    const user = await findOrCreateUser({
      email: userInfo.email,
      name: userInfo.name || "",
      image: userInfo.picture || "",
      googleId: userInfo.id,
    });

    // Create session
    const sessionToken = await createSession(user);

    // Send welcome email for new users
    if (isNewUser) {
      await sendWelcomeEmail(user.email, user.name || "");
    }

    // Set cookie and redirect
    const response = NextResponse.redirect(new URL(callbackUrl, request.url));
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
