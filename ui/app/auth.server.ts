// auth.server.ts
import { redirect } from "react-router";
import { getAuthSession, commitAuthSession } from "~/sessions.server";

export type Identity = {
  userId: string;
  employeeId: string;
  authSessionId?: string;
};

export async function getIdentity(request: Request): Promise<Identity | null> {
  const session = await getAuthSession(request);

  const userId = session.get("userId") as string | undefined;
  const employeeId = session.get("employeeId") as string | undefined;
  const authSessionId = session.get("authSessionId") as string | undefined;

  if (!userId || !employeeId) return null;

  return { userId, employeeId, authSessionId };
}

export async function requireIdentity(
  request: Request,
  opts?: { redirectTo?: string; flashMessage?: string },
): Promise<Identity> {
  const identity = await getIdentity(request);
  if (identity) return identity;

  const session = await getAuthSession(request);
  if (opts?.flashMessage) session.flash("authError", opts.flashMessage);

  throw redirect(opts?.redirectTo ?? "/", {
    headers: { "Set-Cookie": await commitAuthSession(session) },
  });
}
