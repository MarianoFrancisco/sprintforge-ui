import { createContext } from "react-router";
import type { ProjectResponseDTO } from "~/types/scrum/project";

export const userProjectsContext = createContext<ProjectResponseDTO[] | []>([]);
