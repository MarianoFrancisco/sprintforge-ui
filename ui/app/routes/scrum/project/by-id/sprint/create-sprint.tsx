// ~/routes/scrum/project/by-id/sprint/create-sprint.tsx
import { useEffect, useMemo, useState } from "react"
import {
  type ActionFunctionArgs,
  data,
  type MiddlewareFunction,
  redirect,
  useActionData,
  useNavigate,
} from "react-router"
import { toast } from "sonner"

import { projectContext } from "~/context/project-context"
import { sprintService } from "~/services/scrum/sprint-service"
import type { CreateSprintRequestDTO } from "~/types/scrum/sprint"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"

import { requireIdentity } from "~/auth.server"
import { CreateSprintForm } from "~/components/scrum/sprint/sprint-create-form"
import { PERMS } from "~/config/permissions"
import { permissionMiddleware } from "~/middlewares/permission-middleware"
import { commitAuthSession, getAuthSession } from "~/sessions.server"

export function meta() {
  return [{ title: "Crear sprint" }]
}

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.SPRINT_CREATE], {
    flashMessage: "No tienes permiso para crear sprints.",
  }),
];

export async function action({ request, context }: ActionFunctionArgs) {
  const { employeeId } = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })
  const session = await getAuthSession(request);

  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")
  const project = projectCtx.project
  const formData = await request.formData()

  try {
    const name = String(formData.get("name") ?? "").trim()
    const goal = String(formData.get("goal") ?? "").trim()
const startLocal = String(formData.get("startDate") ?? "").trim()
const endLocal = String(formData.get("endDate") ?? "").trim()

const startDate = startLocal ? new Date(startLocal).toISOString() : ""
const endDate = endLocal ? new Date(endLocal).toISOString() : ""

    const payload: CreateSprintRequestDTO & {
      employeeId: string
      projectId: string
    } = {
      employeeId,
      projectId: project.id,
      name,
      goal: goal ? goal : undefined,
      startDate,
      endDate,
    }

    await sprintService.create(payload)
    session.flash("success", "Sprint creado correctamente.");
      return redirect(`/projects/${project.id}/sprints`, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });

  } catch (error: any) {
    console.log("error en action create sprint", error)
        session.flash(
      "error",
      error?.response?.detail || "Error al iniciar el sprint."
    );
    return data({errors: error?.response?.errors || {}}, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    })
  }

}

export default function CreateSprintRoute() {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined

  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  // No hay loader: el project lo trae el middleware y lo guardó en el context.
  // Para el closeTo usamos el path relativo al layout del proyecto (ajústalo si quieres otra ruta).
  // Si tu layout está en /projects/:projectId/*, navegar -1 suele ser suficiente.
  const closeTo = useMemo(() => ".", [])

  function onClose() {
    try {
      navigate(-1)
    } catch {
      navigate(closeTo)
    }
  }

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error)

    if (actionData?.success) {
      toast.success(actionData.success)
      onClose()
    }
  }, [actionData, navigate])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onClose()
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear sprint</DialogTitle>
          <DialogDescription>
            Define nombre, meta y rango de fechas
          </DialogDescription>
        </DialogHeader>

        <CreateSprintForm />
      </DialogContent>
    </Dialog>
  )
}
