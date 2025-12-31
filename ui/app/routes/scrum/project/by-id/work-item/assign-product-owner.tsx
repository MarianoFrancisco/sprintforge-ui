// routes/scrum/project/by-id/work-item/assign-product-owner.tsx
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
import { Loader2, Save } from "lucide-react"

import { requireIdentity } from "~/auth.server"
import { commitAuthSession, getAuthSession } from "~/sessions.server"
import { projectContext } from "~/context/project-context"
import { workItemService } from "~/services/scrum/work-item-service"

import { EmployeeCombobox } from "~/components/common/employee-combobox"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

import type { EmployeeResultResponseDTO } from "~/types/scrum/project"

export function meta() {
  return [{ title: "Asignar Product Owner" }]
}

type LoaderData = {
  employees: EmployeeResultResponseDTO[]
  projectId: string
  workItemId: string
}

export async function loader({ context, params }: LoaderFunctionArgs) {
  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")

  const { project } = projectCtx

  const { workItemId } = params
  if (!workItemId) throw new Error("workItemId no proporcionado")

  const employees = project.employees ?? []

  return data<LoaderData>({
    employees,
    projectId: project.id,
    workItemId,
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

  const { sprintId, workItemId } = params
  if (!workItemId) throw new Error("workItemId no proporcionado")

  const formData = await request.formData()
  const productOwnerId = String(formData.get("productOwnerId") ?? "").trim()

  try {
    if (!productOwnerId) {
      session.flash("error", "Selecciona un Product Owner.")
      return redirect(`/projects/${project.id}`, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      })
    }

    await workItemService.assignProductOwner(workItemId, {
      employeeId,
      productOwnerId,
    })

    session.flash("success", "Product Owner asignado correctamente.")
  } catch (error: any) {
    console.error("error en action assign product owner", error)
    session.flash(
      "error",
      error?.response?.detail || "Error al asignar el Product Owner."
    )
  }

  return redirect(`/projects/${project.id}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  })
}

export default function AssignProductOwnerRoute() {
  const { employees } = useLoaderData<typeof loader>() as LoaderData
  const navigate = useNavigate()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [open, setOpen] = React.useState(true)
  const [productOwnerId, setProductOwnerId] = React.useState<string | null>(null)

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
          <DialogTitle>Asignar Product Owner</DialogTitle>
        </DialogHeader>

        <Form method="post" className="space-y-4">
          <div className="space-y-2">
            <Label>Product Owner</Label>
            <EmployeeCombobox
              employees={employees}
              value={productOwnerId}
              onChange={setProductOwnerId}
              placeholder="Selecciona un Product Owner"
              clearable
            />
            <input
              type="hidden"
              name="productOwnerId"
              value={productOwnerId ?? ""}
            />
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
            disabled={isSubmitting || !productOwnerId}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Asignar
              </>
            )}
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
