import { createContext } from "react-router";
import type { BoardColumnUI } from "~/types/scrum/board-column";

export type BoardTypeContext = {
    boardColumns: BoardColumnUI[] | null;
}

export const boardContext = createContext<BoardTypeContext | null>(null);
