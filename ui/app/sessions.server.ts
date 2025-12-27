import { createCookieSessionStorage } from "react-router"
import { createThemeSessionResolver } from "remix-themes"


export const themeSessionResolver = createThemeSessionResolver(
  createCookieSessionStorage({
    cookie: {
      name: "__remix-themes",
      // domain: 'remix.run',
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secrets: ["s3cr3t"],
      // secure: true,
    },
  }),
);

type AuthSessionData = {
  userId: string;
  employeeId: string;
  authSessionId: string;
};

type AuthSessionFlashData = {
  authError: string;
};

export const authSessionStorage = createCookieSessionStorage<
  AuthSessionData,
  AuthSessionFlashData
>({
  cookie: {
    name: "__auth",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET ?? "dev-secret"],
    secure: process.env.NODE_ENV === "production",
    // maxAge: 60 * 60 * 24 * 7, // opcional: 7 días
  },
});

// Helpers opcionales (recomendados)
export async function getAuthSession(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return authSessionStorage.getSession(cookieHeader);
}

export async function commitAuthSession(session: any) {
  return authSessionStorage.commitSession(session);
}

export async function destroyAuthSession(session: any) {
  return authSessionStorage.destroySession(session);
}

export async function getUserId(request: Request) {
  const session = await getAuthSession(request);
  return session.get("userId") as string | undefined;
}

export async function getEmployeeId(request: Request) {
  const session = await getAuthSession(request);
  return session.get("employeeId") as string | undefined;
}