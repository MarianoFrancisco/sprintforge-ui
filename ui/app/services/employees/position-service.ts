import { apiClient, ApiError } from "~/lib/api-client";
import type {
  CreatePositionRequest,
  PositionResponseDTO,
  UpdatePositionDetailRequest,
  FindPositionsRequest,
} from "~/types/employees/position";

class PositionService {
  private basePath = "/api/v1/position";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error desconocido al procesar la solicitud");
  }

  async getAll(params?: FindPositionsRequest): Promise<PositionResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
      if (params?.isActive !== undefined) queryParams.append("isActive", String(params.isActive));
      if (params?.isDeleted !== undefined) queryParams.append("isDeleted", String(params.isDeleted));

      const qs = queryParams.toString();
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath;

      return await apiClient.get<PositionResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<PositionResponseDTO> {
    try {
      return await apiClient.get<PositionResponseDTO>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: CreatePositionRequest): Promise<PositionResponseDTO> {
    try {
      const created = await apiClient.post<PositionResponseDTO>(this.basePath, request);
      return created;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async update(id: string, request: UpdatePositionDetailRequest): Promise<PositionResponseDTO> {
    try {
      const updated = await apiClient.patch<PositionResponseDTO>(
        `${this.basePath}?id=${id}`,
        request
      );
      return updated;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async activate(id: string): Promise<PositionResponseDTO> {
    try {
      const result = await apiClient.patch<PositionResponseDTO>(
        `${this.basePath}/${id}:activate`
      );
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deactivate(id: string): Promise<PositionResponseDTO> {
    try {
      const result = await apiClient.patch<PositionResponseDTO>(
        `${this.basePath}/${id}:deactivate`
      );
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}?id=${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const positionService = new PositionService();
