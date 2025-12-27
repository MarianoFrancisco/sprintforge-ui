import type { User } from "~/types/identity/auth";
import type { PermissionResponseDTO } from "~/types/identity/permission";
import type { NavItem } from "~/types/navbar/nav-item";

function toPermissionSet(perms: PermissionResponseDTO[]) {
  return new Set(perms.map((p) => p.code));
}

function isAllowed(item: NavItem, permSet: Set<string>) {
  if (item.anyOf?.length) return item.anyOf.some((c) => permSet.has(c));
  if (item.permission) return permSet.has(item.permission);
  return true; // sin permiso requerido => visible
}

export function filterNavByPermissions(nav: NavItem[], user: User): NavItem[] {
  const permSet = toPermissionSet(user.permissions);

  const walk = (items: NavItem[]): NavItem[] =>
    items
      .map((item) => {
        const children = item.items ? walk(item.items) : undefined;
        const allowedSelf = isAllowed(item, permSet);

        // Si el padre no está permitido pero tiene hijos permitidos,
        // lo dejamos para que el grupo exista (opcional).
        const allowedByChildren = Boolean(children && children.length > 0);

        if (!allowedSelf && !allowedByChildren) return null;

        return {
          ...item,
          items: children,
        };
      })
      .filter(Boolean) as NavItem[];

  return walk(nav);
}
