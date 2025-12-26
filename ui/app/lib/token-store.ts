let accessToken: string | null = null;
let accessTokenExpiresAt: number | null = null;

export const tokenStore = {
  setAccessToken(token: string, expiresInSeconds: number) {
    accessToken = token;
    accessTokenExpiresAt = Date.now() + expiresInSeconds * 1000;
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  hasValidAccessToken(): boolean {
    if (!accessToken || !accessTokenExpiresAt) {
      return false;
    }

    return Date.now() < accessTokenExpiresAt;
  },

  isExpired(): boolean {
    if (!accessTokenExpiresAt) {
      return true;
    }

    return Date.now() >= accessTokenExpiresAt;
  },

  clear() {
    accessToken = null;
    accessTokenExpiresAt = null;
  },
};
