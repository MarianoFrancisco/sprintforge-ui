import type { WorkItemResponseDTO } from "~/types/scrum/work-item";
import type {
  BoardColumnResponseDTO,
  BoardColumnUI,
} from "~/types/scrum/board-column";

export function mergeBoardColumnsWithWorkItems(
  workItems: WorkItemResponseDTO[],
  boardColumns: BoardColumnResponseDTO[],
): BoardColumnUI[] {
  if (!boardColumns || boardColumns.length === 0) {
    return [];
  }

  const columnsMap = new Map<string, BoardColumnUI>();

  // 1) Crear columnas base
  for (const column of boardColumns) {
    columnsMap.set(column.id, {
      id: column.id,
      name: column.name,
      position: column.position, // 0-based
      isFinal: column.isFinal,
      isDeleted: column.isDeleted,
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
      items: [],
    });
  }

  // 2) Asociar work items a su columna
  for (const item of workItems) {
    const columnId = item.boardColumn?.id;
    if (!columnId) continue;

    const column = columnsMap.get(columnId);
    if (!column) continue;

    column.items.push({
      id: item.id,
      position: item.position, // 0-based
      title: item.title,
      storyPoints: item.storyPoints ?? null,
      priority: item.priority,
      isDeleted: item.isDeleted,
    });
  }

  // 3) Ordenar items dentro de cada columna por position (0-based)
  for (const column of columnsMap.values()) {
    column.items.sort((a, b) => a.position - b.position);
  }

  // 4) Ordenar columnas por position (0-based) y devolver
  return [...columnsMap.values()].sort(
    (a, b) => a.position - b.position,
  );
}
