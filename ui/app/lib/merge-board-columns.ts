import type { WorkItemResponseDTO } from "~/types/scrum/work-item";
import type { BoardColumnResponseDTO, BoardColumnUI } from "~/types/scrum/board-column";

export function mergeBoardColumnsWithWorkItems(
  workItems: WorkItemResponseDTO[],
  boardColumns: BoardColumnResponseDTO[],
): BoardColumnUI[] {
  if (!boardColumns || boardColumns.length === 0) {
    return [];
  }

  const columnsMap = new Map<string, BoardColumnUI>();

  // Crear columnas base
  for (const column of boardColumns) {
    columnsMap.set(column.id, {
      id: column.id,
      name: column.name,
      position: column.position,
      isFinal: column.isFinal,
      isDeleted: column.isDeleted,
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
      items: [],
    });
  }

  // Asociar work items a su columna (sin ordenar)
  for (const item of workItems) {
    const columnId = item.boardColumn?.id;
    if (!columnId) continue;

    const column = columnsMap.get(columnId);
    if (!column) continue;

    column.items.push({
      id: item.id,
      position: item.position,
      title: item.title,
      storyPoints: item.storyPoints ?? null,
      priority: item.priority,
      isDeleted: item.isDeleted,
    });
  }

  // Se devuelve en el mismo orden que llegan las columnas
  return boardColumns.map((c) => columnsMap.get(c.id)!);
}
