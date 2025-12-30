import { useEffect } from "react"
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

import { requireIdentity } from "~/auth.server"
import { ProjectForm } from "~/components/scrum/project/project-form"
import { employeeService } from "~/services/employees/employee-service"
import { projectService } from "~/services/scrum/project-service"
import type { EmployeeResponseDTO } from "~/types/employees/employee"
import type { CreateProjectRequestDTO } from "~/types/scrum/project"
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import type { MiddlewareFunction } from "react-router";
import { commitAuthSession, getAuthSession } from "~/sessions.server"

export function meta() {
  return [{ title: "Crear proyecto" }]
}

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.PROJECT_CREATE], {
    flashMessage: "No tienes permiso para crear un proyecto."
  }),
];

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
  const session = await getAuthSession(request);
  const identity = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para crear un proyecto.",
  })

  const formData = await request.formData()
  let errors: Record<string, string> = {}

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
    session.flash("success", "Proyecto creado correctamente.");
    return redirect("/projects", {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  } catch (error: any) {
    console.error("Error al crear proyecto", error);
    session.flash("error", error?.response?.detail || "Error al crear el proyecto.");
    errors = error?.response?.errors || {};
  }
  return data({ errors }, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

export default function CreateProjectPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <section className="p-6">
      <ProjectForm employees={data.employees} />
    </section>
  )
}
