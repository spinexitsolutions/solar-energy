import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@lumora.solar";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lumora@2026";
const SECRET = process.env.AUTH_SECRET || "lumora-dev-secret-change-me";
const COOKIE = "lumora_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const sign = (payload: string) =>
  createHmac("sha256", SECRET).update(payload).digest("base64url");

export function checkCredentials(email: string, password: string) {
  const a = Buffer.from(`${email.trim().toLowerCase()}:${password}`);
  const b = Buffer.from(`${ADMIN_EMAIL.toLowerCase()}:${ADMIN_PASSWORD}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession() {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `${ADMIN_EMAIL}.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAuthed() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const i = raw.lastIndexOf(".");
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const exp = Number(payload.slice(payload.lastIndexOf(".") + 1));
  return Number.isFinite(exp) && exp > Date.now();
}

export async function requireAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");
}
