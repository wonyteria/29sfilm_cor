import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { prisma, isDatabaseConfigured } from "./prisma";
import { createSupabaseServerClient } from "./supabase-server";

const sessionCookieName = "with_session";

export type SessionUser = {
  id: string;
  userType: "ADMIN" | "TEACHER";
  name: string;
  email: string;
  emailVerified?: boolean;
};

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabaseUser = await getSupabaseSessionUser();
  if (supabaseUser) return supabaseUser;

  const raw = cookies().get(sessionCookieName)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as SessionUser;
    if (!parsed.id || !parsed.email || !parsed.userType) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setSessionCookie(user: SessionUser) {
  cookies().set(sessionCookieName, Buffer.from(JSON.stringify(user)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14
  });
}

export function clearSessionCookie() {
  cookies().delete(sessionCookieName);
}

export async function loginWithPassword(email: string, password: string) {
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
      email
    } satisfies SessionUser;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  return { id: user.id, userType: user.userType, name: user.name, email: user.email } satisfies SessionUser;
}

export async function signupWithPassword(input: {
  email: string;
  password: string;
  name: string;
  userType: "ADMIN" | "TEACHER";
  adminCode?: string;
  redirectTo?: string;
}) {
  if (input.userType === "ADMIN") {
    if (!process.env.ADMIN_SIGNUP_CODE || input.adminCode !== process.env.ADMIN_SIGNUP_CODE) {
      throw new Error("관리자 가입 코드가 올바르지 않습니다.");
    }
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: input.redirectTo,
      data: {
        name: input.name,
        user_type: input.userType
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
  const name = String(metadata.name || email.split("@")[0] || "사용자");

  if (isDatabaseConfigured() && email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    const safeType = existing?.userType === "ADMIN" ? "ADMIN" : requestedType;
    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        userType: safeType,
        status: user.email_confirmed_at ? "ACTIVE" : "PENDING_EMAIL_VERIFICATION"
      },
      create: {
        id: user.id,
        userType: safeType,
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
      emailVerified: Boolean(user.email_confirmed_at)
    };
  }

  return {
    id: user.id,
    userType: requestedType,
    name,
    email,
    emailVerified: Boolean(user.email_confirmed_at)
  };
}
