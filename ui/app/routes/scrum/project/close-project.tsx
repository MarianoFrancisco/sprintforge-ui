import { redirect } from "react-router"
import type { ActionFunctionArgs, MiddlewareFunction } from "react-router"

import { requireIdentity } from "~/auth.server"
import { PERMS } from "~/config/permissions"
import { permissionMiddleware } from "~/middlewares/permission-middleware"
import { projectService } from "~/services/scrum/project-service"
import type { CloseProjectRequestDTO } from "~/types/scrum/project"

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.PROJECT_CLOSE], {
    flashMessage: "No tienes permiso para cerrar un proyecto."
  }),
];

export async function action({ request, params }: ActionFunctionArgs) {
  const identity = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })

  const projectId = params.id
  if (!projectId) {
    return redirect("/projects")
  }

  try {
    const payload: CloseProjectRequestDTO = {
      employeeId: identity.employeeId,
    }

    await projectService.close(projectId, payload)
  } catch (error) {
    console.error("Error al cerrar proyecto:", error)
    // Intencionalmente no propagamos el error
  }

  return redirect("/projects")
}

export default function CloseProjectPage() {
  return null
}