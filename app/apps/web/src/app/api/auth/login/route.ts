import { NextResponse } from "next/server";
import { loginWithPassword, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const user = await loginWithPassword(String(body.email || "").trim(), String(body.password || ""));
  if (!user) return NextResponse.json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) setSessionCookie(user);
  return NextResponse.json({ user });
}
