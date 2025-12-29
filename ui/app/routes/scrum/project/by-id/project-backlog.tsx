// ~/routes/scrum/projects/project-backlog.tsx
import { type LoaderFunctionArgs, redirect, useLoaderData } from "react-router"
import { Backlog } from "~/components/scrum/project/by-id/backlog"
import { projectContext } from "~/context/project-context"
import { projectMiddleware } from "~/middlewares/project-middleware"

import { workItemService } from "~/services/scrum/work-item-service"
import type { WorkItemResponseDTO } from "~/types/scrum/work-item"


export function meta() {
  return [
    { title: "Backlog" },
    { name: "description", content: "Backlog del proyecto" },
  ]
}

export const handle = {
  crumb: "Backlog",
}

type LoaderData = {
  workItems: WorkItemResponseDTO[]
}

export async function loader({ context }: LoaderFunctionArgs) {
  const project = context.get(projectContext)
  if (!project) throw redirect("/")

  // 1) Traer todas las historias del proyecto
  const all = await workItemService.getAll({ projectId: project.id })

  // 2) Backlog = las que NO tienen boardColumn (o viene null/undefined)
  //    Nota: tu DTO tipa boardColumn como WorkItemBoard, pero en la práctica puede venir null.
  const backlog = (all ?? []).filter((wi) => !wi.boardColumn)

  return { workItems: backlog } satisfies LoaderData
}

export default function ProjectBacklogRoute() {
  const { workItems } = useLoaderData<typeof loader>() as LoaderData
  return (
    <section className="p-6">
      <Backlog workItems={workItems} />
    </section>
  )
}
