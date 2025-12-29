import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { getAuthSession, destroyAuthSession } from "~/sessions.server";
import { authService } from "~/services/identity/auth-service";

export async function action({ request }: ActionFunctionArgs) {
  const session = await getAuthSession(request);
  const authSessionId = session.get("authSessionId") as string | undefined;

  if (authSessionId) {
    try {
      await authService.logout(authSessionId);
    } catch {
      // si falla, igual destruimos sesión local
    }
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroyAuthSession(session),
    },
  });
}

export default function Logout() {
  return null;
}