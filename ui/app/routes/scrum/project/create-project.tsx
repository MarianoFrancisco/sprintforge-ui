import { useEffect } from "react"
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router"
import { toast } from "sonner"

import { requireIdentity } from "~/auth.server"
import { ProjectForm } from "~/components/scrum/project/project-form"
import { employeeService } from "~/services/employees/employee-service"
import { projectService } from "~/services/scrum/project-service"
import type { EmployeeResponseDTO } from "~/types/employees/employee"
import type { CreateProjectRequestDTO } from "~/types/scrum/project"

export function meta() {
  return [{ title: "Crear proyecto" }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para crear un proyecto.",
  })

  try {
    const employees: EmployeeResponseDTO[] = await employeeService.getAll()
    return { employees }
  } catch (error) {
    console.error("Error al cargar empleados", error)
    return { employees: [] as EmployeeResponseDTO[] }
  }
}

/** Action: crea proyecto usando employeeId de sesión */
export async function action({ request }: ActionFunctionArgs) {
  const identity = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para crear un proyecto.",
  })

  const formData = await request.formData()

  try {
    const payload: CreateProjectRequestDTO = {
      employeeId: identity.employeeId,
      projectKey: String(formData.get("projectKey") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: formData.get("description")
        ? String(formData.get("description"))
        : undefined,
      client: String(formData.get("client") ?? ""),
      area: String(formData.get("area") ?? ""),
      budgetAmount: Number(formData.get("budgetAmount")),
      contractAmount: Number(formData.get("contractAmount")),
      employeeIds: JSON.parse(String(formData.get("employeeIds") ?? "[]")),
    }

    await projectService.create(payload)

    return { success: "Proyecto creado exitosamente" }
  } catch (error: any) {
    console.error("Error al crear proyecto", error)
    return { error: error?.message ?? "Ocurrió un error al crear el proyecto" }
  }
}

export default function CreateProjectPage() {
  const data = useLoaderData<typeof loader>()
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined

  const navigate = useNavigate()

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error)

    if (actionData?.success) {
      toast.success(actionData.success, {
        action: {
          label: "Ver proyectos",
          onClick: () => navigate("/projects"),
        },
      })
    }
  }, [actionData, navigate])

  return (
    <section className="p-6">
      <ProjectForm employees={data.employees} />
    </section>
  )
}
