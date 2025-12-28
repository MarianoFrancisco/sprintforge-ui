// ~/lib/permissions.ts
import type { PermissionCode } from "~/config/permissions";

/** true si el set contiene TODOS los permisos requeridos */
export function hasAllPermissions(
  userPerms: ReadonlySet<string>,
  required: readonly PermissionCode[]
): boolean {
  return required.every((p) => userPerms.has(p));
}

/** true si el set contiene AL MENOS UNO de los permisos requeridos */
export function hasAnyPermission(
  userPerms: ReadonlySet<string>,
  required: readonly PermissionCode[]
): boolean {
  return required.some((p) => userPerms.has(p));
}

export type PermissionMode = "all" | "any";

export function hasPermissions(
  userPerms: ReadonlySet<string>,
  required: readonly PermissionCode[],
  mode: PermissionMode = "all",
): boolean {
  if (required.length === 0) return true;
  return mode === "any"
    ? hasAnyPermission(userPerms, required)
    : hasAllPermissions(userPerms, required);
}
