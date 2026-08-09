export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7

export function createSessionCookieOptions(requestUrl: string) {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "Lax",
    secure: new URL(requestUrl).protocol === "https:",
  } as const
}
