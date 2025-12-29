// ~/context/project-context.ts
import { createContext } from "react-router";
import type { ProjectResultResponseDTO } from "~/types/scrum/project";

export const projectContext = createContext<ProjectResultResponseDTO | null>(null);
