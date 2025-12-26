import type { PermissionResponseDTO } from "./permission";

export interface User {
    id: string;
    email: string;
    fullname: string;
    role: string;
    permissions: PermissionResponseDTO[];
    profileImage: string | null;
};

export interface TokenPairResponseDTO {
  tokenType: string;
  accessToken: string;
  accessExpiresInSeconds: number;
  refreshToken: string;
  refreshExpiresInSeconds: number;
  authSessionId: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface RefreshTokenRequestDTO {
  refreshToken: string;
  authSessionId: string;
}

export interface LogoutRequestDTO {
  authSessionId: string;
}