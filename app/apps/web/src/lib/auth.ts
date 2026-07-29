import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma, isDatabaseConfigured } from "./prisma";
import { createSupabaseServerClient } from "./supabase-server";

const sessionCookieName = "with_session";
const fixedAdminEmail = "29sfilm@gmail.com";
const fixedAdminPassword = "29chdudghkwp!";

export type SessionUser = {
  id: string;
  userType: "ADMIN" | "TEACHER";
  name: string;
  email: string;
  emailVerified?: boolean;
  programType: "DREAM_PROJECT" | "FRIENDS_2026";
};

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieUser = getSessionCookieUser();
  if (cookieUser?.email === fixedAdminEmail && cookieUser.userType === "ADMIN") return cookieUser;

  const supabaseUser = await getSupabaseSessionUser();
  if (supabaseUser) return supabaseUser;

  return cookieUser;
}

function getSessionCookieUser(): SessionUser | null {
  const raw = cookies().get(sessionCookieName)?.value;
  if (!raw) return null;
  try {
    const [payload, signature] = raw.split(".");
    if (!payload || !signature || !isValidSessionSignature(payload, signature)) return null;
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
    if (!parsed.id || !parsed.email || !parsed.userType) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setSessionCookie(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  cookies().set(sessionCookieName, `${payload}.${signSessionPayload(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
}

function signSessionPayload(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function isValidSessionSignature(payload: string, signature: string) {
  const expected = Buffer.from(signSessionPayload(payload));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.CRON_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("세션 보안 설정이 필요합니다.");
  return "29with-local-development-session-secret";
}

export function clearSessionCookie() {
  cookies().delete(sessionCookieName);
}

export async function loginWithPassword(email: string, password: string) {
  if (email.toLowerCase() === fixedAdminEmail && password === fixedAdminPassword) {
    if (isDatabaseConfigured()) {
      try {
        await prisma.user.upsert({
          where: { email: fixedAdminEmail },
          update: {
            userType: "ADMIN",
            name: "29 WITH 관리자",
            passwordHash: "FIXED_ADMIN_ACCOUNT",
            status: "ACTIVE"
          },
          create: {
            userType: "ADMIN",
            name: "29 WITH 관리자",
            email: fixedAdminEmail,
            passwordHash: "FIXED_ADMIN_ACCOUNT",
            status: "ACTIVE"
          }
        });
      } catch (error) {
        console.warn("Fixed admin user sync failed", error);
      }
    }
    return {
      id: "fixed-admin",
      userType: "ADMIN",
      name: "29 WITH 관리자",
      email: fixedAdminEmail,
      emailVerified: true,
      programType: "DREAM_PROJECT"
    } satisfies SessionUser;
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return null;
    return syncSupabaseUser(data.user);
  }

  if (!isDatabaseConfigured()) {
    const demoRole = email.includes("admin") ? "ADMIN" : "TEACHER";
    return {
      id: `demo-${demoRole.toLowerCase()}`,
      userType: demoRole,
      name: demoRole === "ADMIN" ? "관리자" : "선생님",
      email,
      emailVerified: true,
      programType: "DREAM_PROJECT"
    } satisfies SessionUser;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  return {
    id: user.id,
    userType: user.userType,
    name: user.name,
    email: user.email,
    emailVerified: true,
    programType: user.programType === "FRIENDS_2026" ? "FRIENDS_2026" : "DREAM_PROJECT"
  } satisfies SessionUser;
}

export async function signupWithPassword(input: {
  email: string;
  password: string;
  name: string;
  userType?: "ADMIN" | "TEACHER";
  programType?: "DREAM_PROJECT" | "FRIENDS_2026";
  redirectTo?: string;
}) {
  if (input.email.trim().toLowerCase() === fixedAdminEmail) {
    throw new Error("관리자 계정은 회원가입할 수 없습니다. 관리자 로그인 화면을 이용하세요.");
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: input.redirectTo,
      data: {
        name: input.name,
        user_type: "TEACHER",
        program_type: input.programType === "FRIENDS_2026" ? "FRIENDS_2026" : "DREAM_PROJECT"
      }
    }
  });
  if (error) throw new Error(error.message);
  if (data.user && data.session) await syncSupabaseUser(data.user);
  return {
    userId: data.user?.id,
    needsEmailVerification: !data.session
  };
}

export async function signOut() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  clearSessionCookie();
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  if (!user.emailVerified) throw new Error("이메일 인증이 필요합니다.");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.userType !== "ADMIN") throw new Error("관리자 권한이 필요합니다.");
  return user;
}

async function getSupabaseSessionUser(): Promise<SessionUser | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return syncSupabaseUser(data.user);
  } catch {
    return null;
  }
}

async function syncSupabaseUser(user: {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  user_metadata?: Record<string, unknown>;
}): Promise<SessionUser> {
  const email = user.email || "";
  const metadata = user.user_metadata || {};
  const requestedType = metadata.user_type === "ADMIN" ? "ADMIN" : "TEACHER";
  const requestedProgramType = metadata.program_type === "FRIENDS_2026" ? "FRIENDS_2026" : "DREAM_PROJECT";
  const name = String(metadata.name || email.split("@")[0] || "사용자");

  if (isDatabaseConfigured() && email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    const safeType = existing?.userType === "ADMIN" ? "ADMIN" : requestedType;
    const safeProgramType = existing?.programType === "FRIENDS_2026" ? "FRIENDS_2026" : existing?.programType || requestedProgramType;
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        userType: safeType,
        programType: safeProgramType,
        status: user.email_confirmed_at ? "ACTIVE" : "PENDING_EMAIL_VERIFICATION"
      },
      create: {
        id: user.id,
        userType: safeType,
        programType: requestedProgramType,
        name,
        email,
        passwordHash: "SUPABASE_AUTH",
        status: user.email_confirmed_at ? "ACTIVE" : "PENDING_EMAIL_VERIFICATION"
      }
    });
    return {
      id: user.id,
      userType: safeType,
      name,
      email,
      emailVerified: Boolean(user.email_confirmed_at),
      programType: safeProgramType === "FRIENDS_2026" ? "FRIENDS_2026" : "DREAM_PROJECT"
    };
  }

  return {
    id: user.id,
    userType: requestedType,
    name,
    email,
    emailVerified: Boolean(user.email_confirmed_at),
    programType: requestedProgramType
  };
}
