// ~/routes/scrum/work-items/create-work-item.tsx
import { useMemo, useState } from "react"
import {
  type ActionFunctionArgs,
  data,
  type LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router"

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
import { commitAuthSession, getAuthSession } from "~/sessions.server"
import type { EmployeeResultResponseDTO } from "~/types/scrum/project"

export function meta() {
  return [{ title: "Crear historia de usuario" }]
}

type LoaderData = {
  project: { id: string; name?: string }
  employeeId: string
  employees: EmployeeResultResponseDTO[]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { employeeId } = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })

  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")
  const { project } = projectCtx

  const employees = project.employees


  try {
    // const employees = await employeeService.getAll({ status: "ACTIVE" })

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

export async function action({ request, context, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request)

  const { employeeId } = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })

  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")
  const { project } = projectCtx

  const formData = await request.formData()
  let errors = {}

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

    const sprintId = params.sprintId?.trim()
    const boardColumnId = params.boardColumnId?.trim()

    const payload: CreateWorkItemRequestDTO = {
      employeeId,
      projectId: project.id,
      title,
      priority,

      description: description || undefined,
      acceptanceCriteria: acceptanceCriteria || undefined,
      storyPoints,

      developerId: developerIdRaw || null,
      productOwnerId: productOwnerIdRaw || null,

      ...(sprintId ? { sprintId } : {}),
      ...(boardColumnId ? { boardColumnId } : {}),
    }

    await workItemService.create(payload)
    session.flash("success", "Historia de usuario creada correctamente")
  } catch (error: any) {
    console.error("error en action create work item", error)
    session.flash("error", error?.response?.detail || "Error al crear la historia de usuario.")
    errors = error?.response?.errors || {}
  }

  return data(
    { errors },
    {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    },
  )
}


export default function CreateWorkItemRoute() {
  const data = useLoaderData<typeof loader>() as LoaderData
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
