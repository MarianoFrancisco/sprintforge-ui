// ~/hooks/use-project.ts
import { useOutletContext } from "react-router";
import type { ProjectResultResponseDTO } from "~/types/scrum/project";

export type ProjectOutletContext = { project: ProjectResultResponseDTO };

export function useProject() {
  const ctx = useOutletContext<ProjectOutletContext | undefined>();
  if (!ctx?.project) {
    throw new Error("useProject() debe usarse dentro del ProjectLayout (Outlet context).");
  }
  return ctx;
}
