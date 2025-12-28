// ~/context/user-context.ts
import { createContext } from "react-router";
import type { User } from "~/types/identity/auth";

export const userContext = createContext<User | null>(null);
