import { cookies } from "next/headers";

const COOKIE_NAME = "elno_admin_session";
const COOKIE_VALUE = "authenticated";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export async function setAdminSession(value: boolean): Promise<void> {
  const cookieStore = await cookies();
  if (value) {
    cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });
  } else {
    cookieStore.delete(COOKIE_NAME);
  }
}
