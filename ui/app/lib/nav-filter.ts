import type { User } from "~/types/identity/auth";
import type { NavItem, NavSubItem } from "~/types/navbar/nav-item";

function isAllowed(
  item: Pick<NavSubItem, "permission" | "anyOf">,
  permSet: Set<string>
) {
  if (item.anyOf?.length) return item.anyOf.some((c) => permSet.has(c));
  if (item.permission) return permSet.has(item.permission);
  return true;
}

function notNull<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function filterNavByPermissions(nav: NavItem[], user: User): NavItem[] {
  const permSet = user.permissions;

  return nav
    .map((item): NavItem | null => {
      const filteredChildren: NavSubItem[] | undefined = item.items
        ? item.items.filter((sub) => isAllowed(sub, permSet))
        : undefined;

      const allowedSelf = isAllowed(item, permSet);
      const allowedByChildren = Boolean(filteredChildren?.length);

      if (!allowedSelf && !allowedByChildren) return null;

      return {
        ...item,
        items: allowedByChildren ? filteredChildren : undefined,
      };
    })
    .filter(notNull);
}
