// ~/context/project-context.ts
import { createContext } from "react-router";
import type { ProjectResultResponseDTO } from "~/types/scrum/project";

export interface SprintTypeContext {
    id: string;
    name: string;
}

export interface ProjectTypeContext {
    project: ProjectResultResponseDTO;
    sprints: SprintTypeContext[];
}

export const projectContext = createContext<ProjectTypeContext | null>(null);
