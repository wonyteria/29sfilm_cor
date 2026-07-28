import { NextResponse } from "next/server";
import { signupWithPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const result = await signupWithPassword({
      email: String(body.email || "").trim(),
      password: String(body.password || ""),
      name: String(body.name || "").trim(),
      userType: "TEACHER",
      redirectTo: `${origin}/api/auth/callback`
    });
    return NextResponse.json({
      ...result,
      message: result.needsEmailVerification
        ? "인증 메일을 보냈습니다. 이메일 인증 후 로그인하세요."
        : "회원가입이 완료되었습니다."
    });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "회원가입을 처리하지 못했습니다." },
      { status: 400 }
    );
  }
}
