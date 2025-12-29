// ~/lib/work-items/group-work-items.ts
import type { SprintStatus, SprintResponseDTO } from "~/types/scrum/sprint"
import type { WorkItemResponseDTO, WorkItemSprint } from "~/types/scrum/work-item"

export type SprintGroup = {
  sprint: WorkItemSprint
  items: WorkItemResponseDTO[]
}

export type GroupedWorkItems = {
  backlog: WorkItemResponseDTO[]
  sprints: Record<string, SprintGroup>
}

function toWorkItemSprint(s: SprintResponseDTO): WorkItemSprint {
  return { id: s.id, name: s.name, status: s.status }
}

/**
 * - backlog: historias sin sprint
 * - sprints: sprints permitidos (aunque estén vacíos)
 * - historias con sprint NO permitido: se omiten
 */
export function groupWorkItemsBySprint(
  workItems: WorkItemResponseDTO[],
  sprints: SprintResponseDTO[] = [],
  allowedStatuses: SprintStatus[] = ["CREATED", "STARTED"]
): GroupedWorkItems {
  const allowed = new Set<SprintStatus>(allowedStatuses)

  const result: GroupedWorkItems = {
    backlog: [],
    sprints: {},
  }

  // 1) Inicializar sprints permitidos (vacíos)
  for (const s of sprints ?? []) {
    if (!allowed.has(s.status)) continue
    const sprint = toWorkItemSprint(s)
    result.sprints[sprint.id] = { sprint, items: [] }
  }

  // 2) Asignar work items
  for (const wi of workItems ?? []) {
    const sprint = wi.sprint

    if (!sprint) {
      result.backlog.push(wi)
      continue
    }

    if (!allowed.has(sprint.status)) {
      continue // omitimos COMPLETED u otros no permitidos
    }

    // Si el sprint no venía en la lista (edge case), igual lo creamos
    if (!result.sprints[sprint.id]) {
      result.sprints[sprint.id] = { sprint, items: [] }
    }

    result.sprints[sprint.id].items.push(wi)
  }

  return result
}
