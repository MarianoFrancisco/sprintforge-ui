import type { TokenPairResponseDTO, User } from "~/types/identity/auth";
import { apiClient, ApiError } from "~/lib/api-client";
import { userService } from "./user-service";
import { employeeService } from "../employees/employee-service";
import { decodeJWTModern } from "~/lib/jwt";
import type { RolePermissionDTO } from "~/types/identity/role";

class AuthService {
  private basePath = "/api/v1/auth";

  private async handleError(error: any): Promise<never> {
    console.error("Auth API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error de autenticación");
  }

  async login(email: string, password: string): Promise<{userId: string, authSessionId: string, employeeId: string}> {
    console.log("AuthService.login called with email:", email);
    console.log("Password :", password);
    try {
      const response = await apiClient.post<TokenPairResponseDTO>(`${this.basePath}/login`, { email, password });

    const payload = decodeJWTModern(response.accessToken);
    
    if (!payload.sub || !payload.eid) {
      throw new Error("Access token sin subject o sin employeeId");
    }

    return { userId: payload.sub, authSessionId: response.authSessionId, employeeId: payload.eid };

    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout(authSessionId:string): Promise<void> {
    try {
      if (authSessionId) {
        await apiClient.post<void>(`${this.basePath}/logout`, {
          authSessionId
        });
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

async getCurrentUser(userId: string): Promise<User> {
  console.log("AuthService.getCurrentUser called with userId:", userId);
  try {
    const user = await userService.getById(userId);
    const employee = await employeeService.getById(user.employeeId);

    const permissionCodes = new Set<string>(
      (user.role.permissions ?? []).map((p: RolePermissionDTO) => p.code)
    );

    return {
      id: user.id,
      employeeId: user.employeeId,
      email: user.email,
      fullname: employee.fullName,
      role: user.role.name,
      permissions: permissionCodes,
      profileImage: employee.profileImage || null,
    };
  } catch (error) {
    return this.handleError(error);
  }
}

}

export const authService = new AuthService();