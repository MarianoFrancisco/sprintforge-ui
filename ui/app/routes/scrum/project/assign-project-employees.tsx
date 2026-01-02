// routes/scrum/project/by-id/assign-project-employees.tsx
import * as React from "react"
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MiddlewareFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router"

import { commitAuthSession, getAuthSession } from "~/sessions.server"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import type { ProjectResultResponseDTO } from "~/types/scrum/project"
import type { EmployeeResponseDTO } from "~/types/employees/employee"
import { projectService } from "~/services/scrum/project-service"
import { employeeService } from "~/services/employees/employee-service"
import { requireIdentity } from "~/auth.server"
import { EmployeeChip } from "~/components/scrum/project/employee-chip"
import { EmployeeAssignForm } from "~/components/scrum/project/employee-assign-form"
import { permissionMiddleware } from "~/middlewares/permission-middleware"
import { PERMS } from "~/config/permissions"

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.PROJECT_ASSIGN_EMPLOYEES], {
    flashMessage: "No tienes permiso para asignar empleados a un proyecto."
  }),
];

type LoaderData = {
  project: ProjectResultResponseDTO
  assignedEmployees: EmployeeResponseDTO[] // para usar EmployeeChip sin pelear con el tipo
  availableEmployees: EmployeeResponseDTO[]
}

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const { projectId } = params
  if (!projectId) throw new Error("projectId no proporcionado")

  // 1) Proyecto con empleados asignados (EmployeeResultResponseDTO[])
  const project = await projectService.getById(projectId)

  // 2) Todos los empleados activos
  const allActive = await employeeService.getAll({ status: "ACTIVE" })

  // 3) IDs asignados al proyecto
  const assignedIds = new Set((project.employees ?? []).map((e) => e.id))

  // 4) Separar: asignados (como EmployeeResponseDTO si existen en allActive) y disponibles
  const assignedEmployees = allActive.filter((e) => assignedIds.has(e.id))
  const availableEmployees = allActive.filter((e) => !assignedIds.has(e.id))

  return { project, assignedEmployees, availableEmployees }
}

// (Opcional) action placeholder para que luego conectes tu endpoint real de asignación
// - recibe employeeIds en CSV (desde EmployeeAssignForm)
// - aquí solo deja el patrón de flash + redirect
export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request)

  const identity = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para asignar empleados.",
  })

  const { projectId } = params
  if (!projectId) throw new Error("projectId no proporcionado")

  const formData = await request.formData()

  // El formulario envía employeeIds como CSV
  const employeeIdsCsv = String(formData.get("employeeIds") ?? "").trim()
  const employeeIds = employeeIdsCsv
    ? employeeIdsCsv.split(",").map((id) => id.trim()).filter(Boolean)
    : []

  if (employeeIds.length === 0) {
    session.flash("error", "Debes seleccionar al menos un empleado.")
    return redirect("..", {
      headers: { "Set-Cookie": await commitAuthSession(session) },
    })
  }

  try {
    await projectService.assignEmployees(projectId, {
      employeeId: identity.employeeId, // quien realiza la acción
      employeeIds,                     // empleados a asignar
    })

    session.flash("success", "Empleados asignados correctamente.")
  } catch (error: any) {
    session.flash(
      "error",
      error?.response?.detail || "Error al asignar empleados al proyecto."
    )
  }

  return redirect(`/projects/${projectId}`, {
    headers: { "Set-Cookie": await commitAuthSession(session) },
  })
}

export default function AssignProjectEmployeesRoute() {
  const { project, assignedEmployees, availableEmployees } =
    useLoaderData() as LoaderData

  const navigate = useNavigate()

  return (
    <Dialog open onOpenChange={(open) => (!open ? navigate("..") : null)}>
      <DialogContent className="sm:max-w-[820px]">
        <DialogHeader>
          <DialogTitle>Asignar empleados</DialogTitle>
          <DialogDescription>
            Proyecto: <span className="font-medium">{project.name}</span> (
            {project.projectKey})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Asignados actualmente */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Empleados asignados</p>
              <p className="text-xs text-muted-foreground">
                {assignedEmployees.length} asignados
              </p>
            </div>

            {assignedEmployees.length ? (
              <div className="flex flex-wrap gap-2">
                {assignedEmployees.map((e) => (
                  <EmployeeChip
                    key={e.id}
                    employee={{
                      id: e.id,
                      email: e.email,
                      fullName: e.fullName,
                      profileImage: e.profileImage ?? null,
                    }}
                    showRemoveButton={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Este proyecto no tiene empleados asignados.
              </p>
            )}
          </div>

          {/* Formulario para asignar */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Agregar empleados</p>

            <EmployeeAssignForm
              employees={availableEmployees}
              fieldName="employeeIds"
              submitLabel="Guardar"
              maxSelected={undefined}
            />

            {availableEmployees.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No hay empleados activos disponibles para agregar.
              </p>
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => navigate("..")}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
