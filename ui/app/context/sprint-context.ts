// ~/context/project-context.ts
import { createContext } from "react-router";
export interface SprintTypeContext {
    id: string;
    name: string;
}

export const sprintContext = createContext<SprintTypeContext | null>(null);
