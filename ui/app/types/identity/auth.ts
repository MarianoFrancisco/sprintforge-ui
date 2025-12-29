export interface User {
    id: string;
    employeeId: string;
    email: string;
    fullname: string;
    role: string;
    permissions: Set<string>;
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
