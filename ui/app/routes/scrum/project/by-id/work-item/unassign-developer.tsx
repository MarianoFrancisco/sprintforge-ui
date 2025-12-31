// routes/scrum/project/by-id/work-item/unassign-developer.tsx
import * as React from "react"
import {
  data,
  Form,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router"
import { Loader2, UserMinus } from "lucide-react"

import { requireIdentity } from "~/auth.server"
import { commitAuthSession, getAuthSession } from "~/sessions.server"
import { projectContext } from "~/context/project-context"
import { workItemService } from "~/services/scrum/work-item-service"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"

import type { WorkItemResultResponseDTO } from "~/types/scrum/work-item"

export function meta() {
  return [{ title: "Desasignar developer" }]
}

type LoaderData = {
  projectId: string
  workItem: WorkItemResultResponseDTO
}

export async function loader({ context, params }: LoaderFunctionArgs) {
  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")

  const { project } = projectCtx

  const { workItemId } = params
  if (!workItemId) throw new Error("workItemId no proporcionado")

  const workItem = await workItemService.getById(workItemId)

  return data<LoaderData>({
    projectId: project.id,
    workItem,
  })
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request)

  const { employeeId } = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })

  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")

  const { project } = projectCtx

  const { workItemId } = params
  if (!workItemId) throw new Error("workItemId no proporcionado")

  const formData = await request.formData()
  const confirmedWorkItemId = String(formData.get("workItemId") ?? "").trim()

  try {
    if (!confirmedWorkItemId || confirmedWorkItemId !== workItemId) {
      session.flash("error", "Confirmación inválida.")
      return redirect(`/projects/${project.id}`, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      })
    }

    // (Opcional) validar que realmente tenga developer asignado
    const current = await workItemService.getById(workItemId)
    if (!current.developerId?.id) {
      session.flash("error", "Este work item no tiene developer asignado.")
      return redirect(`/projects/${project.id}`, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      })
    }

    await workItemService.unassignDeveloper(workItemId, { employeeId })

    session.flash("success", "Developer desasignado correctamente.")
  } catch (error: any) {
    console.error("error en action unassign developer", error)
    session.flash(
      "error",
      error?.response?.detail || "Error al desasignar el developer."
    )
  }

  return redirect(`/projects/${project.id}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  })
}

export default function UnassignDeveloperRoute() {
  const { workItem } = useLoaderData<typeof loader>() as LoaderData
  const navigate = useNavigate()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [open, setOpen] = React.useState(true)

  const developerName = workItem.developerId?.fullName ?? "—"
  const hasDeveloper = Boolean(workItem.developerId?.id)

  function onClose() {
    try {
      navigate(-1)
    } catch {
      navigate("/")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onClose()
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Desasignar developer</DialogTitle>
        </DialogHeader>

        {!hasDeveloper ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Este work item no tiene developer asignado.
            </p>
            <Button type="button" variant="secondary" className="w-full" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        ) : (
          <Form method="post" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Seguro que deseas desasignar a{" "}
              <span className="font-medium text-foreground">{developerName}</span>{" "}
              de esta historia de usuario?
            </p>

            {/* Confirmación para el action */}
            <input type="hidden" name="workItemId" value={workItem.id} />

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <UserMinus className="h-4 w-4" />
                    Desasignar
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
