// routes/scrum/project/by-id/sprint/complete-sprint.tsx
import {
  type ActionFunctionArgs,
  type MiddlewareFunction,
  redirect,
} from "react-router";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { requireIdentity } from "~/auth.server";
import { commitAuthSession, getAuthSession } from "~/sessions.server";
import { sprintService } from "~/services/scrum/sprint-service";

export function meta() {
  return [{ title: "Eliminar sprint" }];
}

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.SPRINT_DELETE], {
    flashMessage: "No tienes permiso para eliminar sprints.",
  }),
];

export async function action({ request, params }: ActionFunctionArgs) {
    const session = await getAuthSession(request);

  const { sprintId, projectId } = params;
  if (!sprintId) throw new Error("sprintId no proporcionado");
  if (!projectId) throw new Error("projectId no proporcionado");

  try {
    const identity = await requireIdentity(request, {
      redirectTo: "/",
      flashMessage: "Sesión no válida. Inicia sesión nuevamente.",
    });

    await sprintService.delete(sprintId, identity.employeeId);

    session.flash("success", "Sprint eliminado correctamente.");
  } catch (error: any) {
    session.flash(
      "error",
      error?.response?.detail || "Error al eliminar el sprint."
    );
  }

  return redirect(`/projects/${projectId}/sprints`, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

export default function DeleteSprintPage() {
  return null;
}
