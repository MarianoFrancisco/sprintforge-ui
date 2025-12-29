// employee-payment-service.ts
import { apiClient, ApiError } from "~/lib/api-client";
import type {
  GetAllPaymentsQuery,
  PayEmployeeRequestDTO,
  PaymentResponseDTO,
} from "~/types/employees/employee-payment";

class EmployeePaymentService {
  private basePath = "/api/v1/employee/payment";

  private async handleError(error: any): Promise<never> {
    console.error("API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error desconocido al procesar la solicitud");
  }

  async getAll(params?: GetAllPaymentsQuery): Promise<PaymentResponseDTO[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.employee) queryParams.append("employee", params.employee);
      if (params?.position) queryParams.append("position", params.position);
      if (params?.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params?.toDate) queryParams.append("toDate", params.toDate);

      const qs = queryParams.toString();
      const endpoint = qs ? `${this.basePath}?${qs}` : this.basePath;

      return await apiClient.get<PaymentResponseDTO[]>(endpoint);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async payEmployee(cui: string, request: PayEmployeeRequestDTO): Promise<PaymentResponseDTO> {
    try {
      return await apiClient.post<PaymentResponseDTO>(`${this.basePath}/${cui}`, request);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const employeePaymentService = new EmployeePaymentService();
