// lib/permissions.ts
import type { User } from "~/types/identity/auth";

export function hasPermission(user: User, code: string) {
  return user.permissions?.some((p) => p.code === code) ?? false;
}
