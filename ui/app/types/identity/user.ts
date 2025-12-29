import type { RoleResponseDTO } from "./role";

export type UserStatus = 'ACTIVE' | 'LOCKED' | 'DISABLED' | 'PENDING_ACTIVATION';

// UserResponseDTO
export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  employeeId: string;
  role: RoleResponseDTO;
  status: UserStatus;
  lastLoginAt: string;
  emailVerifiedAt: string;
  mfaEnabled: boolean;
  mfaSecret: string;
  createdAt: string;
  updatedAt: string;
}

// GetAllUsersQuery
export interface GetAllUsersQuery {
  searchTerm?: string;
  status?: string;
  isDeleted?: boolean;
}

// UpdateUserRoleRequestDTO
export interface UpdateUserRoleRequestDTO {
  roleId: string;
}