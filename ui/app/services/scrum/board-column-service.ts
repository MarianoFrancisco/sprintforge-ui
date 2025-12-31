// ~/services/board/board-column-service.ts
import { apiClient, ApiError } from "~/lib/api-client";
import type {
  BoardColumnResponseDTO,
  CreateBoardColumnRequestDTO,
  MoveBoardColumnRequestDTO,
  FindBoardColumnsRequestDTO,
} from "~/types/scrum/board-column";

class BoardColumnService {
  private basePath = "/api/v1/board-column";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error desconocido al procesar la solicitud");
  }

  /**
   * GET /api/v1/board-column?sprintId=...&searchTerm=...
   */
  async getAll(params: FindBoardColumnsRequestDTO): Promise<BoardColumnResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      // requerido
      queryParams.append("sprintId", params.sprintId);

      // opcional
      if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);

      const endpoint = `${this.basePath}?${queryParams.toString()}`;
      return await apiClient.get<BoardColumnResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET /api/v1/board-column/{id}
   */
  async getById(id: string): Promise<BoardColumnResponseDTO> {
    try {
      return await apiClient.get<BoardColumnResponseDTO>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST /api/v1/board-column
   */
  async create(request: CreateBoardColumnRequestDTO): Promise<BoardColumnResponseDTO> {
    try {
      const created = await apiClient.post<BoardColumnResponseDTO>(this.basePath, request);
      return created;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH /api/v1/board-column/position
   */
  async move(request: MoveBoardColumnRequestDTO): Promise<BoardColumnResponseDTO> {
    try {
      const updated = await apiClient.patch<BoardColumnResponseDTO>(
        `${this.basePath}/position`,
        request
      );
      return updated;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
 * PATCH /api/v1/board-column/{id}/name
 */
  async updateName(
    id: string,
    request: {
      employeeId: string;
      name: string;
    }
  ): Promise<BoardColumnResponseDTO> {
    try {
      const updated = await apiClient.patch<BoardColumnResponseDTO>(
        `${this.basePath}/${id}/name`,
        request
      );
      return updated;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
 * PATCH /api/v1/board-column/{id}
 * (Soft delete / delete con comando)
 */
  async delete(
    id: string,
    request: { employeeId: string; targetBoardColumnId?: string }
  ): Promise<void> {
    try {
      // Si no te mandan targetBoardColumnId, asumimos que es el mismo id
      const payload = {
        employeeId: request.employeeId,
        targetBoardColumnId: request.targetBoardColumnId ?? id,
      };

      await apiClient.patch<void>(`${this.basePath}/${id}`, payload);
    } catch (error) {
      return this.handleError(error);
    }
  }

}

export const boardColumnService = new BoardColumnService();
