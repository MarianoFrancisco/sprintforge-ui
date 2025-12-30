import { apiClient, ApiError } from "~/lib/api-client";
import type {
  EmployeeResponseDTO,
  HireEmployeeRequest,
  UpdateEmployeeDetailRequest,
  FindEmployeesRequest,
  IncreaseEmployeeSalaryRequest,
  ReinstateEmployeeRequest,
  SuspendEmployeeRequest,
  TerminateEmployeeRequest
} from "~/types/employees/employee";
import type { EmploymentHistoryResponseDTO, GetAllEmploymentHistoriesQuery } from "~/types/employees/employment-history";

class EmployeeService {
  private basePath = "/api/v1/employee";

  private async handleError(error: any): Promise<never> {
    if (error instanceof ApiError) throw error;
    throw new Error(error.message || "Request error");
  }

  async getAll(params?: FindEmployeesRequest): Promise<EmployeeResponseDTO[]> {
    try {
      const query = new URLSearchParams();
      if (params?.searchTerm) query.append("searchTerm", params.searchTerm);
      if (params?.position) query.append("position", params.position);
      if (params?.workloadType) query.append("workloadType", params.workloadType);
      if (params?.status) query.append("status", params.status);

      const endpoint = query.toString()
        ? `${this.basePath}?${query.toString()}`
        : this.basePath;

      return await apiClient.get<EmployeeResponseDTO[]>(endpoint);
    } catch (e) {
      console.error("Error fetching employees:", e);
      return []
    }
  }

  async getById(id: string): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.get<EmployeeResponseDTO>(`${this.basePath}/${id}`);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async getByCui(cui: string): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.get<EmployeeResponseDTO>(`${this.basePath}/cui/${cui}`);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async getByEmail(email: string): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.get<EmployeeResponseDTO>(`${this.basePath}/email/${email}`);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async hire(request: HireEmployeeRequest): Promise<EmployeeResponseDTO> {
    try {
      const formData = new FormData();

      Object.entries(request).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      return await apiClient.postForm<EmployeeResponseDTO>(
        this.basePath,
        formData
      );
    } catch (e) {
      return this.handleError(e);
    }
  }

  async update(
    id: string,
    request: UpdateEmployeeDetailRequest
  ): Promise<EmployeeResponseDTO> {
    try {
      const formData = new FormData();

      Object.entries(request).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      return await apiClient.patchForm<EmployeeResponseDTO>(
        `${this.basePath}/${id}`,
        formData
      );
    } catch (e) {
      return this.handleError(e);
    }
  }

  async increaseSalary(
    cui: string,
    request: IncreaseEmployeeSalaryRequest
  ): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.post<EmployeeResponseDTO>(
        `${this.basePath}/${cui}/salary/increase`,
        request
      );
    } catch (e) {
      return this.handleError(e);
    }
  }

  async reinstate(
    cui: string,
    request: ReinstateEmployeeRequest
  ): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.post<EmployeeResponseDTO>(
        `${this.basePath}/${cui}/reinstate`,
        request
      );
    } catch (e) {
      return this.handleError(e);
    }
  }

  async suspend(
    cui: string,
    request: SuspendEmployeeRequest
  ): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.post<EmployeeResponseDTO>(
        `${this.basePath}/${cui}/suspend`,
        request
      );
    } catch (e) {
      return this.handleError(e);
    }
  }

  async terminate(
    cui: string,
    request: TerminateEmployeeRequest
  ): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.post<EmployeeResponseDTO>(
        `${this.basePath}/${cui}/terminate`,
        request
      );
    } catch (e) {
      return this.handleError(e);
    }
  }

    async getAllHistories(params?: GetAllEmploymentHistoriesQuery): Promise<EmploymentHistoryResponseDTO[]> {
    try {
      const query = new URLSearchParams();
      
      if (params?.employee) query.append("employee", params.employee);
      if (params?.position) query.append("position", params.position);
      if (params?.type) query.append("type", params.type);
      if (params?.startDateFrom) query.append("startDateFrom", params.startDateFrom);
      if (params?.startDateTo) query.append("startDateTo", params.startDateTo);

      const endpoint = query.toString()
        ? `${this.basePath}/history?${query.toString()}`
        : `${this.basePath}/history`;

      return await apiClient.get<EmploymentHistoryResponseDTO[]>(endpoint);
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export const employeeService = new EmployeeService();
