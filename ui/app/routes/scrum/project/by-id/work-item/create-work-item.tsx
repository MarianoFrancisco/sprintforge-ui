// ~/routes/scrum/work-items/create-work-item.tsx
import { useEffect, useMemo, useState } from "react"
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router"
import { toast } from "sonner"
import { ApiError } from "~/lib/api-client"

import { projectContext } from "~/context/project-context"
import { employeeService } from "~/services/employees/employee-service"
import { workItemService } from "~/services/scrum/work-item-service"

import type { EmployeeResponseDTO } from "~/types/employees/employee"
import type { CreateWorkItemRequestDTO } from "~/types/scrum/work-item"


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"
import { CreateUserStoryForm } from "~/components/scrum/work-item/work-item-create-form"
import { requireIdentity } from "~/auth.server"

export function meta() {
  return [{ title: "Crear historia de usuario" }]
}

type LoaderData = {
  project: { id: string; name?: string }
  employeeId: string
  employees: EmployeeResponseDTO[]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
      const {employeeId} = await requireIdentity(request, {
        redirectTo: "/",
        flashMessage: "Debes iniciar sesión para realizar esta acción.",
      })

  const project = context.get(projectContext)
  if (!project) throw redirect("/")

  try {
    const employees = await employeeService.getAll({ status: "ACTIVE" })

    return {
      project: { id: project.id, name: (project as any).name },
      employeeId,
      employees,
    } satisfies LoaderData
  } catch (error) {
    console.error("Error loader create work item", error)
    return {
      project: { id: project.id, name: (project as any).name },
      employeeId,
      employees: [],
    } satisfies LoaderData
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
    const {employeeId} = await requireIdentity(request, {
      redirectTo: "/",
      flashMessage: "Debes iniciar sesión para realizar esta acción.",
    })
  const project = context.get(projectContext)
  if (!project) throw redirect("/")


  const formData = await request.formData()

  try {
    const title = String(formData.get("title") ?? "").trim()
    const description = String(formData.get("description") ?? "").trim()
    const acceptanceCriteria = String(formData.get("acceptanceCriteria") ?? "").trim()

    const priorityRaw = String(formData.get("priority") ?? "").trim()
    const storyPointsRaw = String(formData.get("storyPoints") ?? "").trim()

    const developerIdRaw = String(formData.get("developerId") ?? "").trim()
    const productOwnerIdRaw = String(formData.get("productOwnerId") ?? "").trim()

    const priority = Number(priorityRaw)
    const storyPoints = storyPointsRaw ? Number(storyPointsRaw) : null

    const payload: CreateWorkItemRequestDTO & {
      employeeId: string
      projectId: string
    } = {
      employeeId,
      projectId: project.id,
      title,
      priority,
      description: description ? description : undefined,
      acceptanceCriteria: acceptanceCriteria ? acceptanceCriteria : undefined,
      storyPoints,
      developerId: developerIdRaw ? developerIdRaw : null,
      productOwnerId: productOwnerIdRaw ? productOwnerIdRaw : null,
    }

    await workItemService.create(payload as any)

    return {
      success: "Historia de usuario creada correctamente",
    }
  } catch (error: any) {
    console.log("error en action create work item", error)

    if (error instanceof ApiError && error.response) {
      try {
        const errorData = (error.response as any).data || error.response
        return {
          errors: errorData.errors || {},
          error: errorData.detail || errorData.message || `Error ${error.status}`,
        }
      } catch {
        return { error: `Error ${error.status}: No se pudo procesar la respuesta` }
      }
    }

    return { error: error?.message || "Error al crear la historia de usuario" }
  }
}

export default function CreateWorkItemRoute() {
  const data = useLoaderData<typeof loader>() as LoaderData
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined

  const navigate = useNavigate()

  const [open, setOpen] = useState(true)

  const closeTo = useMemo(() => `/projects/${data.project.id}`, [data.project.id])

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
          label: "Ver proyecto",
          onClick: () => navigate(closeTo),
        },
      })

      // Cerrar modal y volver
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
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crear historia de usuario</DialogTitle>
          <DialogDescription>
            Proyecto: <span className="font-medium">{data.project.name ?? data.project.id}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Formulario (responsive) */}
        <CreateUserStoryForm employees={data.employees} />
      </DialogContent>
    </Dialog>
  )
}
