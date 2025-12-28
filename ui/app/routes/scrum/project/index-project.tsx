// ~/routes/project/index.tsx
import { Link, useLoaderData, useActionData, useNavigate } from "react-router"
import { useEffect } from "react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import type { FindProjectsRequestDTO, ProjectResponseDTO } from "~/types/scrum/project"
import { projectService } from "~/services/scrum/project-service"
import { ProjectFilter } from "~/components/scrum/project/project-filters"
import { ProjectsTable } from "~/components/scrum/project/project-table"


export function meta() {
  return [
    { title: "Proyectos" },
    { name: "description", content: "Gestión de proyectos del sistema" },
  ]
}

export const handle = {
  crumb: "Listado de proyectos",
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams.entries())

  const filters: FindProjectsRequestDTO = {}

  if (params.searchTerm && params.searchTerm.trim() !== "") {
    filters.searchTerm = params.searchTerm.trim()
  }

  // select: all | true | false
  if (params.isClosed && params.isClosed !== "all") {
    filters.isClosed = params.isClosed === "true"
  }

  try {
    const projects = await projectService.getAll(filters)
    return Response.json(projects)
  } catch (error) {
    console.error("Error al cargar proyectos:", error)
    return Response.json([], { status: 500 })
  }
}

export default function ProjectsPage() {
  const projects = useLoaderData<typeof loader>() as ProjectResponseDTO[]

  // Por si vienes de una action (close/open/delete) y mandas {success|error}
  const actionData = useActionData() as { success?: string; error?: string } | undefined
  const navigate = useNavigate()

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error)
    if (actionData?.success) toast.success(actionData.success)
  }, [actionData, navigate])

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
        <p className="text-muted-foreground">
          Gestiona proyectos, asignaciones y estado (abierto/cerrado).
        </p>
      </div>

      {/* Filtros + botón crear */}
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
        <div className="flex-1">
          <ProjectFilter />
        </div>

        <div className="flex justify-end lg:justify-start">
          <Button asChild>
            <Link to="/projects/create">Nuevo Proyecto</Link>
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <ProjectsTable data={projects} />
    </section>
  )
}
