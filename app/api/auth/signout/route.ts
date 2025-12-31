import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  await destroySession();

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete("session");

  return response;
}

export async function POST(request: NextRequest) {
  await destroySession();

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete("session");

  return response;
}
