// ~/routes/projects/$projectId/board/board-redirect.tsx
import { redirect, type LoaderFunctionArgs } from "react-router";
import { projectContext } from "~/context/project-context";

export async function loader({ context }: LoaderFunctionArgs) {
  const projectCtx = context.get(projectContext);

  // No hay proyecto en contexto
  if (!projectCtx) {
    throw redirect("/");
  }

  const { project, sprints } = projectCtx;

  // No hay sprints
  if (!sprints || sprints.length === 0) {
    throw redirect("/");
  }

  // Tomamos el primer sprint
  const sprintId = sprints[0].id;

  throw redirect(`/projects/${project.id}/board/${sprintId}`);
}

export default function BoardRedirect() {
  return null;
}