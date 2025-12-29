export function decodeJWTModern(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    
    return JSON.parse(json);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}
