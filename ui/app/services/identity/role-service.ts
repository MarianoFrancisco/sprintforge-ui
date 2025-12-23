import { apiClient, ApiError } from "~/lib/api-client";
import type {
  RoleResponseDTO,
  CreateRoleRequest,
  UpdateRoleRequest,
  FindRolesRequest,
} from "~/types/identity/role";

class RoleService {
  private basePath = "/api/v1/role";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error desconocido al procesar la solicitud");
  }

  async getAll(params?: FindRolesRequest): Promise<RoleResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
      if (params?.isActive !== undefined) queryParams.append("isActive", String(params.isActive));
      if (params?.isDeleted !== undefined) queryParams.append("isDeleted", String(params.isDeleted));

      const qs = queryParams.toString();
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath;

      return await apiClient.get<RoleResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<RoleResponseDTO> {
    try {
      return await apiClient.get<RoleResponseDTO>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: CreateRoleRequest): Promise<RoleResponseDTO> {
    try {
      return await apiClient.post<RoleResponseDTO>(this.basePath, request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, request: UpdateRoleRequest): Promise<RoleResponseDTO> {
    try {
      return await apiClient.patch<RoleResponseDTO>(
        `${this.basePath}/${id}`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async activate(id: string): Promise<RoleResponseDTO> {
    try {
      return await apiClient.patch<RoleResponseDTO>(
        `${this.basePath}/${id}:activate`
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deactivate(id: string): Promise<RoleResponseDTO> {
    try {
      return await apiClient.patch<RoleResponseDTO>(
        `${this.basePath}/${id}:deactivate`
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const roleService = new RoleService();
