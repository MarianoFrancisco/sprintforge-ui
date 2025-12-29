// ~/services/scrum/sprint-service.ts
import { apiClient, ApiError } from "~/lib/api-client"
import type {
  SprintResponseDTO,
  FindSprintsRequest,
  CreateSprintRequestDTO,
  StartSprintRequestDTO,
  CompleteSprintRequestDTO,
} from "~/types/scrum/sprint"

class SprintService {
  private basePath = "/api/v1/sprint"

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error)

    if (error instanceof ApiError) {
      throw error
    }

    throw new Error(error?.message || "Error desconocido al procesar la solicitud")
  }

  async getAll(params: FindSprintsRequest): Promise<SprintResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams()

      // requerido por el controller
      queryParams.append("projectId", params.projectId)

      if (params.searchTerm && params.searchTerm.trim() !== "") {
        queryParams.append("searchTerm", params.searchTerm.trim())
      }

      if (params.status && String(params.status).trim() !== "") {
        queryParams.append("status", String(params.status).trim())
      }

      const endpoint = `${this.basePath}?${queryParams.toString()}`
      return await apiClient.get<SprintResponseDTO[]>(endpoint)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<SprintResponseDTO> {
    try {
      return await apiClient.get<SprintResponseDTO>(`${this.basePath}/${id}`)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async create(request: CreateSprintRequestDTO): Promise<SprintResponseDTO> {
    try {
        console.log("Creating sprint with request:", request)
      return await apiClient.post<SprintResponseDTO>(this.basePath, request)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async start(id: string, request: StartSprintRequestDTO): Promise<SprintResponseDTO> {
    try {
      return await apiClient.patch<SprintResponseDTO>(
        `${this.basePath}/${id}/start`,
        request
      )
    } catch (error) {
      return this.handleError(error)
    }
  }

  async complete(
    id: string,
    request: CompleteSprintRequestDTO
  ): Promise<SprintResponseDTO> {
    try {
      return await apiClient.patch<SprintResponseDTO>(
        `${this.basePath}/${id}/complete`,
        request
      )
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * (Opcional / futuro)
   * Si luego expones los endpoints de update/delete (ya existen en el controller como handlers),
   * aquí puedes agregarlos.
   */
  // async delete(id: string, request: { employeeId: string }): Promise<void> {
  //   try {
  //     await apiClient.delete(`${this.basePath}/${id}`, request)
  //   } catch (error) {
  //     return this.handleError(error)
  //   }
  // }
}

export const sprintService = new SprintService()
