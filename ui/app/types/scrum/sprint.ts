// ~/types/scrum/sprint.ts
import type { ProjectResponseDTO } from "./project"

export type SprintStatus = 'CREATED' | 'STARTED' | 'COMPLETED';
// Query params del GET /sprint
export interface FindSprintsRequest {
  projectId: string
  searchTerm?: string
  status?: SprintStatus
}

export interface SprintResponseDTO {
  id: string
  name: string
  goal?: string
  status: SprintStatus
  startDate: string
  endDate: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  project: ProjectResponseDTO
}

export interface CreateSprintRequestDTO {
  employeeId: string
  projectId: string
  name: string
  goal?: string
  startDate: string
  endDate: string
}

export interface StartSprintRequestDTO {
  employeeId: string
}

export interface CompleteSprintRequestDTO {
  employeeId: string
  targetSprintId?: string | null
}
