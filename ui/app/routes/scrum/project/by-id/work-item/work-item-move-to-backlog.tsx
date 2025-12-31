// ~/routes/scrum/project/by-id/work-item/move-work-item-to-sprint.tsx
import {
  type ActionFunctionArgs,
  redirect,
} from "react-router"

import { projectContext } from "~/context/project-context"
import { requireIdentity } from "~/auth.server"
import { workItemService } from "~/services/scrum/work-item-service"
import type { MoveWorkItemsToBacklogRequestDTO } from "~/types/scrum/work-item"
import { commitAuthSession, getAuthSession } from "~/sessions.server"

export function meta() {
  return [{ title: "Mover historia de usuario" }]
}

/**
 * Action: sprintId es obligatorio (no backlog aquí)
 */
export async function action({ request, context, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);
  const { employeeId } = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })

  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")
    const { project } = projectCtx;

  const workItemId = params.workItemId
  if (!workItemId) throw redirect(`/projects/${project.id}/backlog`)

  try {
    const payload: MoveWorkItemsToBacklogRequestDTO = {
      employeeId,
      ids: [workItemId],
    }

    await workItemService.moveToBacklog(payload)
    session.flash("success", "Historia de usuario movida correctamente.")

  } catch (error: any) {
    console.log("error en action move work item to sprint", error)
    session.flash("error", error?.response?.detail || "Error al desactivar el rol.");
  }

      return redirect(`/projects/${project.id}/backlog`, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    })
}


export default function MoveWorkItemToBacklogRoute() {
 return null;
}
