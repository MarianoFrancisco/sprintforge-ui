// ~/hooks/use-project.ts
import { useOutletContext } from "react-router";
import type { ProjectResultResponseDTO } from "~/types/scrum/project";
import type { SprintTypeContext } from "~/context/project-context";

export type ProjectOutletContext = {
  project: ProjectResultResponseDTO;
  sprints: SprintTypeContext[];
};

export function useProject() {
  const ctx = useOutletContext<ProjectOutletContext | undefined>();

  if (!ctx?.project) {
    throw new Error(
      "useProject() debe usarse dentro del ProjectLayout (Outlet context).",
    );
  }

  return ctx;
}
