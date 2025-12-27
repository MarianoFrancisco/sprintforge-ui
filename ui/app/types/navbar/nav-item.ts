import type { PermissionCode } from "~/config/permissions";

export type NavItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean
  // si no tiene permission => público dentro del layout
  permission?: PermissionCode;
  anyOf?: PermissionCode[];
  items?: NavItem[];
};
