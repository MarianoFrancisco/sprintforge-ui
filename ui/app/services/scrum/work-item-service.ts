// ~/services/scrum/work-item-service.ts
import { apiClient, ApiError } from "~/lib/api-client";
import type {
  CreateWorkItemRequestDTO,
  DeleteWorkItemRequestDTO,
  FindWorkItemsRequest,
  MoveWorkItemInBoardColumnRequestDTO,
  MoveWorkItemsBetweenBoardColumnsRequestDTO,
  MoveWorkItemsToBacklogRequestDTO,
  MoveWorkItemsToSprintRequestDTO,
  WorkItemResponseDTO,
  WorkItemResultResponseDTO,
} from "~/types/scrum/work-item";

class WorkItemService {
  private basePath = "/api/v1/work-item";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) throw error;

    throw new Error(error?.message || "Error desconocido al procesar la solicitud");
  }

  async getAll(params?: FindWorkItemsRequest): Promise<WorkItemResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.projectId) queryParams.append("projectId", params.projectId);
      if (params?.sprintId) queryParams.append("sprintId", params.sprintId);
      if (params?.boardColumnId) queryParams.append("boardColumnId", params.boardColumnId);
      if (params?.priority !== undefined) queryParams.append("priority", String(params.priority));
      if (params?.developerId) queryParams.append("developerId", params.developerId);
      if (params?.productOwnerId) queryParams.append("productOwnerId", params.productOwnerId);
      if (params?.searchTerm && params.searchTerm.trim() !== "") {
        queryParams.append("searchTerm", params.searchTerm.trim());
      }

      const qs = queryParams.toString();
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath;

      return await apiClient.get<WorkItemResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getById(id: string): Promise<WorkItemResultResponseDTO> {
    try {
      return await apiClient.get<WorkItemResultResponseDTO>(`${this.basePath}/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async create(request: CreateWorkItemRequestDTO): Promise<WorkItemResponseDTO> {
    try {
      return await apiClient.post<WorkItemResponseDTO>(this.basePath, request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(id: string, request: DeleteWorkItemRequestDTO): Promise<void> {
    try {
      await apiClient.patch(`${this.basePath}/${id}`, request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async moveInBoardColumn(
    id: string,
    request: MoveWorkItemInBoardColumnRequestDTO
  ): Promise<WorkItemResponseDTO> {
    try {
      return await apiClient.patch<WorkItemResponseDTO>(`${this.basePath}/${id}/move`, request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async moveBetweenColumns(request: MoveWorkItemsBetweenBoardColumnsRequestDTO): Promise<void> {
    try {
      await apiClient.patch<void>(`${this.basePath}/move/between-columns`, request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async moveToBacklog(request: MoveWorkItemsToBacklogRequestDTO): Promise<void> {
    try {
      await apiClient.patch<void>(`${this.basePath}/move/to-backlog`, request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async moveToSprint(request: MoveWorkItemsToSprintRequestDTO): Promise<void> {
    try {
      await apiClient.patch<void>(`${this.basePath}/move/to-sprint`, request);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const workItemService = new WorkItemService();
