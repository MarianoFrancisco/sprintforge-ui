export interface PositionResponseDTO {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePositionRequest {
  name: string;
  description?: string;
}

export interface UpdatePositionDetailRequest {
  name?: string;
  description?: string;
}

export interface FindPositionsRequest {
  searchTerm?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}
