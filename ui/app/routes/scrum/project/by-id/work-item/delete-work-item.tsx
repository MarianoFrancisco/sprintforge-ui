// ~/routes/scrum/project/by-id/work-item/work-item-delete.tsx
import {
  type ActionFunctionArgs,
  redirect,
} from "react-router";

import { projectContext } from "~/context/project-context";
import { requireIdentity } from "~/auth.server";
import { workItemService } from "~/services/scrum/work-item-service";
import type { DeleteWorkItemRequestDTO } from "~/types/scrum/work-item";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta() {
  return [{ title: "Eliminar historia de usuario" }];
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);

  const { employeeId } = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  });

  const projectCtx = context.get(projectContext);
  if (!projectCtx) throw redirect("/");

  const { project } = projectCtx;

  const workItemId = params.workItemId;
  if (!workItemId) {
    session.flash("error", "Historia de usuario no encontrada.");
    return redirect(`/projects/${project.id}/backlog`, {
      headers: { "Set-Cookie": await commitAuthSession(session) },
    });
  }

  try {
    const payload: DeleteWorkItemRequestDTO = {
      employeeId,
    };

    await workItemService.delete(workItemId, payload);

    session.flash("success", "Historia de usuario eliminada correctamente.");
  } catch (error: any) {
    console.error("error en action delete work item", error);
    session.flash(
      "error",
      error?.response?.detail || "Error al eliminar la historia de usuario."
    );
  }

  return redirect(`/projects/${project.id}/backlog`, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

export default function WorkItemDeleteRoute() {
  return null;
}
