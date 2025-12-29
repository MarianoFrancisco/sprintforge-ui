import { redirect } from "react-router"
import type { ActionFunctionArgs } from "react-router"

import { requireIdentity } from "~/auth.server"
import { projectService } from "~/services/scrum/project-service"
import type { OpenProjectRequestDTO } from "~/types/scrum/project"

export async function action({ request, params }: ActionFunctionArgs) {
  const identity = await requireIdentity(request, {
    redirectTo: "/login",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })

  const projectId = params.id
  if (!projectId) {
    return redirect("/projects")
  }

  try {
    const payload: OpenProjectRequestDTO = {
      employeeId: identity.employeeId,
    }

    await projectService.open(projectId, payload)
  } catch (error) {
    console.error("Error al abrir proyecto:", error)
  }
  return redirect("/projects")
}

export default function OpenProjectPage() {
  return null
}