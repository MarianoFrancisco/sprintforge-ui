export interface ProjectEmployeeDTO {
  employeeId: string
}

export interface ProjectResponseDTO {
  id: string
  projectKey: string
  name: string
  description?: string
  client: string
  area: string
  budgetAmount: number
  contractAmount: number
  isClosed: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  assignments: ProjectEmployeeDTO[]
}

export interface CreateProjectRequestDTO {
  employeeId: string
  projectKey: string
  name: string
  description?: string
  client: string
  area: string
  budgetAmount: number
  contractAmount: number
  employeeIds: string[]
}

export interface AssignProjectEmployeesRequestDTO {
  employeeId: string
  employeeIds: string[]
}

export interface UnassignProjectEmployeesRequestDTO {
  employeeId: string
  employeeIds: string[]
}

export interface CloseProjectRequestDTO {
  employeeId: string
}

export interface OpenProjectRequestDTO {
  employeeId: string
}

export interface FindProjectsRequestDTO {
  searchTerm?: string
  isClosed?: boolean
}

export interface EmployeeResultResponseDTO {
  id: string
  email: string
  fullName: string
  profileImage?: string | null
  position: string
}

export interface ProjectResultResponseDTO {
  id: string
  projectKey: string
  name: string
  description?: string
  client: string
  area: string
  budgetAmount: number
  contractAmount: number
  isClosed: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  employees: EmployeeResultResponseDTO[]
}

export interface UpdateProjectNameRequestDTO {
  employeeId: string
  name: string
}

export interface UpdateProjectDescriptionRequestDTO {
  employeeId: string
  description?: string
}

export interface UpdateProjectClientRequestDTO {
  employeeId: string
  client: string
}

export interface UpdateProjectAreaRequestDTO {
  employeeId: string
  area: string
}

export interface UpdateProjectAmountsRequestDTO {
  employeeId: string
  budgetAmount: number
  contractAmount: number
}
