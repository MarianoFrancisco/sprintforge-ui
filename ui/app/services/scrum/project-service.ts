// services/project-service.ts
import { apiClient, ApiError } from "~/lib/api-client";

import type {
  ProjectResponseDTO,
  CreateProjectRequestDTO,
  AssignProjectEmployeesRequestDTO,
  UnassignProjectEmployeesRequestDTO,
  OpenProjectRequestDTO,
  CloseProjectRequestDTO,
  // DTOs que aún no creamos (asumidos):
  ProjectResultResponseDTO,
  FindProjectsRequestDTO,
  UpdateProjectNameRequestDTO,
  UpdateProjectDescriptionRequestDTO,
  UpdateProjectClientRequestDTO,
  UpdateProjectAreaRequestDTO,
  UpdateProjectAmountsRequestDTO,
} from "~/types/scrum/project";

class ProjectService {
  private basePath = "/api/v1/project";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(
      error?.message || "Error desconocido al procesar la solicitud"
    );
  }

  /** GET /api/v1/project?searchTerm&isActive */
  async getAll(params?: FindProjectsRequestDTO): Promise<ProjectResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
      if (params?.isActive !== undefined)
        queryParams.append("isActive", String(params.isActive));

      const qs = queryParams.toString();
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath;

      return await apiClient.get<ProjectResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** GET /api/v1/project/{id} */
  async getById(id: string): Promise<ProjectResultResponseDTO> {
    try {
      return await apiClient.get<ProjectResultResponseDTO>(
        `${this.basePath}/${id}`
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** POST /api/v1/project */
  async create(request: CreateProjectRequestDTO): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.post<ProjectResponseDTO>(this.basePath, request);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/name */
  async updateName(
    id: string,
    request: UpdateProjectNameRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/name`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/description */
  async updateDescription(
    id: string,
    request: UpdateProjectDescriptionRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/description`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/client */
  async updateClient(
    id: string,
    request: UpdateProjectClientRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/client`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/area */
  async updateArea(
    id: string,
    request: UpdateProjectAreaRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/area`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/amounts */
  async updateAmounts(
    id: string,
    request: UpdateProjectAmountsRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/amounts`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/assign */
  async assignEmployees(
    id: string,
    request: AssignProjectEmployeesRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/assign`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/unassign */
  async unassignEmployees(
    id: string,
    request: UnassignProjectEmployeesRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/unassign`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/open */
  async open(
    id: string,
    request: OpenProjectRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/open`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  /** PATCH /api/v1/project/{id}/close */
  async close(
    id: string,
    request: CloseProjectRequestDTO
  ): Promise<ProjectResponseDTO> {
    try {
      return await apiClient.patch<ProjectResponseDTO>(
        `${this.basePath}/${id}/close`,
        request
      );
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const projectService = new ProjectService();
