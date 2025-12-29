export interface RolePermissionDTO {
  id: string
  code: string
  name: string
  category: string
}

export interface RoleResponseDTO {
  id: string
  name: string
  description: string
  isDefault: boolean
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  permissions: RolePermissionDTO[]
}

export interface CreateRoleRequest {
  name: string
  description?: string
  permissionIds: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissionIds?: string[]
}

export interface FindRolesRequest {
  searchTerm?: string
  isActive?: boolean
  isDeleted?: boolean
}
