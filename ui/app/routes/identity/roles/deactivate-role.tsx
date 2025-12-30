// routes/identity/roles/activate-role.tsx
import {
  type ActionFunctionArgs,
  type MiddlewareFunction,
  redirect,
} from "react-router";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";

import { roleService } from "~/services/identity/role-service";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta() {
  return [{ title: "Desactivar rol" }];
}
export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.ROLE_VIEW, PERMS.ROLE_DEACTIVATE], {
    flashMessage: "No tienes permiso para desactivar Roles."
  }),
];

// Action: petición POST para activar el rol
export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);
  const { id } = params;
  if (!id) throw new Error("ID del rol no proporcionado");

  try {
    await roleService.deactivate(id);
    session.flash("success", "Rol desactivado correctamente.");

    return redirect("/identity/roles", {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  } catch (error: any) {
    session.flash("error", error?.response?.detail || "Error al desactivar el rol.");
  }
  return redirect("/identity/roles", {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

export default function DeactivateRolePage() {
  return null;
}
