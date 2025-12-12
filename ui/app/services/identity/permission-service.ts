// services/security/permission-service.ts
import { apiClient, ApiError } from "~/lib/api-client";
import type { PermissionResponseDTO } from "~/types/identity/permission";

export interface FindPermissionsRequest {
  searchTerm?: string;
}

class PermissionService {
  private basePath = "/api/v1/permission";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error desconocido al procesar la solicitud");
  }

  async getAll(params?: FindPermissionsRequest): Promise<PermissionResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);

      const qs = queryParams.toString();
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath;

      return await apiClient.get<PermissionResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<PermissionResponseDTO> {
    try {
      return await apiClient.get<PermissionResponseDTO>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getByCode(code: string): Promise<PermissionResponseDTO> {
    try {
      return await apiClient.get<PermissionResponseDTO>(`${this.basePath}/code/${code}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const permissionService = new PermissionService();
