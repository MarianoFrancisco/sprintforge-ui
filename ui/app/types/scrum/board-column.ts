// ~/types/board-column.ts
import type { WorkItemResponseDTO, WorkItemSprint } from "./work-item";

export interface FindBoardColumnsRequestDTO {
  sprintId: string;
  searchTerm?: string;
}


export interface BoardColumnResponseDTO {
  id: string;
  name: string;
  position: number;
  isFinal: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sprint: WorkItemSprint;
}
export interface BoardColumnItemUI {
  id: string;
  position: number;
  title: string;
  storyPoints?: number | null;
  priority: number;
  isDeleted: boolean;
}

export interface BoardColumnUI {
    id: string;
    name: string;
    position: number;
    isFinal: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    items: BoardColumnItemUI[];
}

/**
 * Requests
 */
export interface CreateBoardColumnRequestDTO {
  employeeId: string;
  sprintId: string;
  name: string;
}

export interface MoveBoardColumnRequestDTO {
  employeeId: string;
  columnId: string;
  newPosition: number;
}
