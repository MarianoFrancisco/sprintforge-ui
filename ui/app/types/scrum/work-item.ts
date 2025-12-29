import type { EmployeeResultResponseDTO } from "./project";

export interface FindWorkItemsRequest {
  projectId?: string;
  sprintId?: string;
  boardColumnId?: string;
  priority?: number;
  developerId?: string;
  productOwnerId?: string;
  searchTerm?: string;
}

export interface DeleteWorkItemRequestDTO {
  employeeId: string;
}

export interface WorkItemBoard {
  id: string;
  name: string;
}

export interface WorkItemResponseDTO {
  id: string;
  position: number;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number | null;
  priority: number;
  developerId?: string | null;
  productOwnerId?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  boardColumn: WorkItemBoard;
}

export interface WorkItemResultResponseDTO {
  id: string;
  position: number;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number | null;
  priority: number;
  developerId?: EmployeeResultResponseDTO | null;
  productOwnerId?: EmployeeResultResponseDTO | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  boardColumn: WorkItemBoard;
}

export interface CreateWorkItemRequestDTO {
  employeeId: string;
  projectId: string;
  sprintId?: string | null;
  boardColumnId?: string | null;
  title: string;
  description?: string;
  acceptanceCriteria?: string;
  storyPoints?: number | null;
  priority: number;
  developerId?: string | null;
  productOwnerId?: string | null;
}

export interface MoveWorkItemInBoardColumnRequestDTO {
  employeeId: string;
  newPosition: number;
}

export interface MoveWorkItemsBetweenBoardColumnsRequestDTO {
  employeeId: string;
  sprintId: string;
  targetBoardColumnId: string;
  targetPosition: number;
  ids: string[];
}

export interface MoveWorkItemsToBacklogRequestDTO {
  employeeId: string;
  ids: string[];
}

export interface MoveWorkItemsToSprintRequestDTO {
  employeeId: string;
  ids: string[];
  sprintId: string;
}
