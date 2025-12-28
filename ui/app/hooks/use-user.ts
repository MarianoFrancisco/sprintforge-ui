// ~/hooks/use-auth.ts
import { useOutletContext } from "react-router";
import type { User } from "~/types/identity/auth";

export type UserOutletContext = { user: User };

export function useUser() {
  const ctx = useOutletContext<UserOutletContext | undefined>();
  if (!ctx?.user) {
    throw new Error("useUser() debe usarse dentro del SidebarLayout (Outlet context).");
  }
  return ctx;
}
