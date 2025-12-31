// ~/routes/scrum/project/by-id/work-item/move-work-item-to-sprint.tsx
import { useEffect, useMemo, useState } from "react"
import {
  type ActionFunctionArgs,
  data,
  type LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router"
import { toast } from "sonner"

import { projectContext } from "~/context/project-context"
import { requireIdentity } from "~/auth.server"

import { sprintService } from "~/services/scrum/sprint-service"
import { workItemService } from "~/services/scrum/work-item-service"

import type { SprintResponseDTO } from "~/types/scrum/sprint"
import type { MoveWorkItemsToSprintRequestDTO } from "~/types/scrum/work-item"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"
import { WorkItemMoveToSprintForm } from "~/components/scrum/work-item/work-item-move-to-sprint"
import { commitAuthSession, getAuthSession } from "~/sessions.server"

export function meta() {
  return [{ title: "Mover historia de usuario" }]
}

type LoaderData = {
  project: { id: string; name?: string }
  workItem: { id: string; title?: string; sprintId?: string | null }
  sprints: SprintResponseDTO[]
}

/**
 * Loader: valida que la historia exista + carga sprints para el combobox
 */
export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const session = await getAuthSession(request);
  await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })
  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")
    const { project } = projectCtx;

  const workItemId = params.workItemId
  if (!workItemId) throw redirect(`/projects/${project.id}/backlog`)

  try {
    const workItem = await workItemService.getById(workItemId)
    const sprints = await sprintService.getAll({ projectId: project.id })

    return {
      project: { id: project.id, name: (project as any).name },
      workItem: {
        id: workItemId,
        title: (workItem as any)?.title,
        sprintId: (workItem as any)?.sprintId ?? null,
      },
      sprints,
    } satisfies LoaderData
  } catch (error) {
    console.error("Error loader move work item to sprint", error)
    const errorMessage = (error as any)?.response?.detail || "Error al cargar la historia de usuario."
    session.flash("error", errorMessage)
    throw redirect(`/projects/${project.id}/backlog`, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    })
  }
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

  const formData = await request.formData()

  try {
    const sprintIdRaw = String(formData.get("sprintId") ?? "").trim()

    const payload: MoveWorkItemsToSprintRequestDTO = {
      employeeId,
      ids: [workItemId],
      sprintId: sprintIdRaw,
    }

    await workItemService.moveToSprint(payload)
    session.flash("success", "Historia de usuario movida correctamente.")

    return redirect(`/projects/${project.id}/backlog`, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    })

  } catch (error: any) {
    console.log("error en action move work item to sprint", error)
    session.flash("error", error?.response?.detail || "Error al desactivar el rol.");
    return data({errors: error?.response?.errors || {} }, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    })
  }
}


export default function MoveWorkItemToSprintRoute() {
  const data = useLoaderData<typeof loader>() as LoaderData
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined

  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  const closeTo = useMemo(
    () => `/projects/${data.project.id}/backlog`,
    [data.project.id],
  )

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
      toast.success(actionData.success, {
        action: {
          label: "Ver backlog",
          onClick: () => navigate(closeTo),
        },
      })
      navigate(closeTo)
    }
  }, [actionData, navigate, closeTo])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onClose()
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Mover historia de usuario</DialogTitle>
          <DialogDescription>
            {data.workItem.title ? (
              <span className="font-medium">{data.workItem.title}</span>
            ) : (
              <>Selecciona el sprint destino.</>
            )}
          </DialogDescription>
        </DialogHeader>

        <WorkItemMoveToSprintForm
          sprints={data.sprints}
          // si tiene sprintId => se preselecciona; si no, queda vacío (y el action lo exige)
          sprint={data.workItem.sprintId ?? null}
        />
      </DialogContent>
    </Dialog>
  )
}
