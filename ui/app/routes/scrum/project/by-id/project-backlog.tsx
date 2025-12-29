// ~/routes/scrum/projects/project-backlog.tsx
import { type LoaderFunctionArgs, redirect, useLoaderData } from "react-router"
import { Separator } from "~/components/ui/separator"

import { projectContext } from "~/context/project-context"
import { workItemService } from "~/services/scrum/work-item-service"
import type { WorkItemResponseDTO } from "~/types/scrum/work-item"

import { Backlog } from "~/components/scrum/project/by-id/backlog-component"
import { SprintBacklog } from "~/components/scrum/project/by-id/sprint-component"

import { groupWorkItemsBySprint, type SprintGroup } from "~/lib/filter-work-items"
import { sprintService } from "~/services/scrum/sprint-service"

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
  backlog: WorkItemResponseDTO[]
  sprints: Record<string, SprintGroup>
}

export async function loader({ context }: LoaderFunctionArgs) {
  const projectCtx = context.get(projectContext)
  if (!projectCtx) throw redirect("/")

  const { project } = projectCtx

  const [allWorkItems, allSprints] = await Promise.all([
    workItemService.getAll({ projectId: project.id }),
    sprintService.getAll({ projectId: project.id }),
  ])

  const { backlog, sprints } = groupWorkItemsBySprint(allWorkItems, allSprints)

  return { backlog, sprints } satisfies LoaderData
}

export default function ProjectBacklogRoute() {
  const { backlog, sprints } = useLoaderData<typeof loader>() as LoaderData

  const sprintGroups = Object.values(sprints)

  return (
    <section className="space-y-6 p-6">
      {/* BACKLOG principal */}
      <Backlog workItems={backlog} />

      {/* Separador entre backlog y el primer sprint (si hay sprints) */}
      {sprintGroups.length > 0 ? <Separator /> : null}

      {/* Sprints */}
      {sprintGroups.map((group, idx) => (
        <div key={group.sprint.id} className="space-y-6">
          <SprintBacklog sprint={group.sprint} workItems={group.items} />

          {/* Separador entre sprints */}
          {idx < sprintGroups.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </section>
  )
}
