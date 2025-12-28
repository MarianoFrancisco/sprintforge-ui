// ~/middlewares/permission-middleware.ts
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getAuthSession, commitAuthSession } from "~/sessions.server";
import { userContext } from "~/context/user-context";
import { hasPermissions, type PermissionMode } from "~/lib/permissions";
import type { PermissionCode } from "~/config/permissions";
import type { User } from "~/types/identity/auth";

type PermissionMiddlewareOptions = {
  /** por defecto "all": requiere todos los permisos */
  mode?: PermissionMode;

  /** si no hay permisos, a dónde redirigir */
  redirectTo?: string;

  /** mensaje flash (si no, uno genérico) */
  flashMessage?: string;
};

export function permissionMiddleware(
  required: readonly PermissionCode[],
  opts: PermissionMiddlewareOptions = {}
) {
  const {
    mode = "all",
    redirectTo = "/",
    flashMessage = "No tienes permisos para acceder a esta sección.",
  } = opts;

  return async ({ context, request }: LoaderFunctionArgs) => {
    // Se asume que authMiddleware ya corrió.
    const user = context.get(userContext) as User | null;
    if (!user) {
      throw redirect("/login");
    }

    const allowed = hasPermissions(user.permissions, required, mode);
    if (allowed) return;

    // Flash opcional (siguiendo tu patrón)
    const session = await getAuthSession(request);
    session.flash("authError", flashMessage);

    throw redirect(redirectTo, {
      headers: { "Set-Cookie": await commitAuthSession(session) },
    });
  };
}
