// ~/routes/projects/$projectId/board/board-redirect.tsx
import { redirect, type LoaderFunctionArgs } from "react-router";
import { projectContext } from "~/context/project-context";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const session = await getAuthSession(request);
  const projectCtx = context.get(projectContext);

  // No hay proyecto en contexto
  if (!projectCtx) {
    throw redirect("/");
  }

  const { project, sprints } = projectCtx;

  // No hay sprints
  if (!sprints || sprints.length === 0) {
    session.flash("error", "No hay sprints disponibles en este proyecto.");
    throw redirect(`/projects/${project.id}`, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  }

  // Tomamos el primer sprint
  const sprintId = sprints[0].id;

  throw redirect(`/projects/${project.id}/board/${sprintId}`);
}

export default function BoardRedirect() {
  return null;
}