// ~/services/project-payment-service.ts
import { apiClient, ApiError } from "~/lib/api-client"
import type {
  GetAllPaymentsQuery,
  CreatePaymentRequestDTO,
  PaymentResponseDTO,
} from "~/types/scrum/project-payment"

class ProjectPaymentService {
  private basePath = "/api/v1/payment"

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error)

    if (error instanceof ApiError) {
      throw error
    }

    throw new Error(error.message || "Error desconocido al procesar la solicitud")
  }

  async getAll(params?: GetAllPaymentsQuery): Promise<PaymentResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams()

      if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm)
      if (params?.projectId) queryParams.append("projectId", params.projectId)
      if (params?.method) queryParams.append("method", params.method)
      if (params?.fromDate) queryParams.append("fromDate", params.fromDate)
      if (params?.toDate) queryParams.append("toDate", params.toDate)

      const qs = queryParams.toString()
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath

      return await apiClient.get<PaymentResponseDTO[]>(endpoint)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async getById(id: string): Promise<PaymentResponseDTO> {
    try {
      return await apiClient.get<PaymentResponseDTO>(`${this.basePath}/${id}`)
    } catch (error) {
      return this.handleError(error)
    }
  }

  async create(request: CreatePaymentRequestDTO): Promise<PaymentResponseDTO> {
    try {
      return await apiClient.post<PaymentResponseDTO>(this.basePath, request)
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export const projectPaymentService = new ProjectPaymentService()
