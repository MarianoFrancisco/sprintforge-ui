import { apiClient, ApiError } from "~/lib/api-client";
import type {
  UserResponseDTO,
  GetAllUsersQuery,
  UpdateUserRoleRequestDTO
} from "~/types/identity/user";

class UserService {
  private basePath = "/api/v1/user";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error desconocido al procesar la solicitud");
  }

  async getAll(params?: GetAllUsersQuery): Promise<UserResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.isDeleted !== undefined) queryParams.append("isDeleted", String(params.isDeleted));

      const qs = queryParams.toString();
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath;

      return await apiClient.get<UserResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<UserResponseDTO> {
    try {
      return await apiClient.get<UserResponseDTO>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async changeRole(id: string, request: UpdateUserRoleRequestDTO): Promise<UserResponseDTO> {
    try {
      return await apiClient.patch<UserResponseDTO>(
        `${this.basePath}/${id}/role`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const userService = new UserService();
