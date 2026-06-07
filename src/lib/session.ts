import { cookies } from "next/headers";

const TOKEN_COOKIE = "fundwell_token";
const NAME_COOKIE = "fundwell_name";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setSession(token: string, name: string): Promise<void> {
  const store = await cookies();
  const common = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };
  store.set(TOKEN_COOKIE, token, common);
  store.set(NAME_COOKIE, encodeURIComponent(name), common);
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(NAME_COOKIE);
}

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getUserName(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(NAME_COOKIE)?.value;
  return raw ? decodeURIComponent(raw) : null;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getToken()) !== null;
}
