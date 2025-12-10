import { apiClient, ApiError } from "~/lib/api-client";
import type {
  EmployeeResponseDTO,
  HireEmployeeRequest,
  UpdateEmployeeDetailRequest,
  FindEmployeesRequest,
} from "~/types/employees/employee";

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
      if (params?.isActive !== undefined) query.append("isActive", String(params.isActive));
      if (params?.isDeleted !== undefined) query.append("isDeleted", String(params.isDeleted));

      const endpoint = query.toString()
        ? `${this.basePath}?${query.toString()}`
        : this.basePath;

      return await apiClient.get<EmployeeResponseDTO[]>(endpoint);
    } catch (e) {
      return this.handleError(e);
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
      Object.entries(request).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v as any);
      });

      return await apiClient.postForm<EmployeeResponseDTO>(this.basePath, formData);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async update(id: string, request: UpdateEmployeeDetailRequest): Promise<EmployeeResponseDTO> {
    try {
      const formData = new FormData();
      Object.entries(request).forEach(([k, v]) => {
        if (v !== undefined && v !== null) formData.append(k, v as any);
      });

      return await apiClient.patchForm<EmployeeResponseDTO>(
        `${this.basePath}/${id}`,
        formData
      );
    } catch (e) {
      return this.handleError(e);
    }
  }

  async activate(id: string): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.patch<EmployeeResponseDTO>(`${this.basePath}/${id}:activate`);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async deactivate(id: string): Promise<EmployeeResponseDTO> {
    try {
      return await apiClient.patch<EmployeeResponseDTO>(`${this.basePath}/${id}:deactivate`);
    } catch (e) {
      return this.handleError(e);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}/${id}`);
    } catch (e) {
      return this.handleError(e);
    }
  }
}

export const employeeService = new EmployeeService();
