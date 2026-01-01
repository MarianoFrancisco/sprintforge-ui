// routes/employees/positions/deactivate-position.tsx
import {
  type ActionFunctionArgs,
  type MiddlewareFunction,
  redirect,
} from "react-router";

import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { positionService } from "~/services/employees/position-service";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta() {
  return [{ title: "Desactivar puesto" }];
}

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.POSITION_VIEW, PERMS.POSITION_DEACTIVATE], {
    flashMessage: "No tienes permiso para desactivar puestos.",
  }),
];

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);
  const { id } = params;

  if (!id) throw new Error("ID del puesto no proporcionado");

  try {
    await positionService.deactivate(id);
    session.flash("success", "Puesto desactivado correctamente.");

    return redirect("/employees/positions", {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  } catch (error: any) {
    session.flash(
      "error",
      error?.response?.detail || "Error al desactivar el puesto."
    );

    return redirect("/employees/positions", {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  }
}

export default function DeactivatePositionPage() {
  return null;
}
