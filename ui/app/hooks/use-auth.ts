// hooks/use-auth.ts
import { useRouteLoaderData } from "react-router";
import type { loader as sidebarLayoutLoader } from "~/layouts/sidebar-layout";

export function useAuth() {
  const data = useRouteLoaderData<typeof sidebarLayoutLoader>("layouts/sidebar-layout");
  if (!data) throw new Error("useAuth() debe usarse dentro de SidebarLayout.");
  return data; // { user }
}
