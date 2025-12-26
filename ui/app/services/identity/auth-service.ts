import { publicApi, ApiError } from "~/lib/public-api";
import { tokenStore } from "~/lib/token-store";
import type { TokenPairResponseDTO, User } from "~/types/identity/auth";
import { apiClient } from "~/lib/api-client";
import { decodeJWTModern } from "~/lib/jwt";
import { userService } from "./user-service";
import { employeeService } from "../employees/employee-service";

class AuthService {
  private basePath = "/api/v1/auth";

  private async handleError(error: any): Promise<never> {
    console.error("Auth API Error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(error.message || "Error de autenticación");
  }

  async login(email: string, password: string): Promise<{userId: string, authSessionId: string}> {
    console.log("AuthService.login called with email:", email);
    console.log("Password :", password);
    try {
      const response = await publicApi.post<TokenPairResponseDTO>(`${this.basePath}/login`, { email, password });

      this.persistTokens(response);

    const payload = decodeJWTModern(response.accessToken);
    
    if (!payload.sub) {
      throw new Error("Access token sin subject");
    }

    return { userId: payload.sub, authSessionId: response.authSessionId };

    } catch (error) {
      return this.handleError(error);
    }
  }

//   async refresh(): Promise<void> {
//     try {
//       const refreshToken = authStorage.getRefreshToken();
// const authSessionId = authStorage.getAuthSessionId();


//       if (!refreshToken || !authSessionId) {
//         throw new Error("No hay sesión activa");
//       }

//       const response = await publicApi.post<TokenPairResponseDTO>(
//         `${this.basePath}/refresh`,
//         {
//           refreshToken,
//           authSessionId,
//         }
//       );

//       this.persistTokens(response);
//     } catch (error) {
//       this.clearSession();
//       return this.handleError(error);
//     }
//   }

  async logout(authSessionId:string): Promise<void> {
    try {
      if (authSessionId) {
        await apiClient.post<void>(`${this.basePath}/logout`, {
          authSessionId
        });
      }
    } catch (error) {
      console.warn("Logout remoto falló, limpiando sesión local");
    } finally {
      this.clearSession();
    }
  }

  async getCurrentUser(userId: string): Promise<User> {
    try {
      const user = await userService.getById(userId);
      const employee = await employeeService.getById(user.employeeId);
      
      return {
        id: user.id,
        email: user.email,
        fullname: employee.fullName,
        role: user.role.name,
        permissions: user.role.permissions,
        profileImage: employee.profileImage || null,
      };

    } catch (error) {
      return this.handleError(error);
    }
  }

private persistTokens(response: TokenPairResponseDTO) {
  tokenStore.setAccessToken(
    response.accessToken,
    response.accessExpiresInSeconds
  );
}


  private clearSession() {
    tokenStore.clear();
  }

  isAuthenticated(): boolean {
    return tokenStore.hasValidAccessToken();
  }
}

export const authService = new AuthService();
