// ~/middlewares/project-middleware.ts
import { redirect, type LoaderFunctionArgs } from "react-router";
import { projectContext, type SprintTypeContext } from "~/context/project-context";
import { projectService } from "~/services/scrum/project-service";
import { sprintService } from "~/services/scrum/sprint-service";
import { getAuthSession, commitAuthSession } from "~/sessions.server";

type ProjectMiddlewareOptions = {
  redirectTo?: string;
  flashMessage?: string;
  paramKey?: string;
};

export function projectMiddleware(opts: ProjectMiddlewareOptions = {}) {
  const {
    redirectTo = "/",
    flashMessage = "No se pudo cargar el proyecto.",
    paramKey,
  } = opts;

  return async ({ context, request, params }: LoaderFunctionArgs) => {
    const session = await getAuthSession(request);

    // Se asume que authMiddleware ya corrió
    const projectId =
      (paramKey ? params[paramKey] : undefined) ?? params.projectId;

    if (!projectId) {
      session.flash("authError", "Falta el identificador del proyecto.");
      throw redirect(redirectTo, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }

    try {
      const project = await projectService.getById(projectId);

      if (!project) {
        session.flash("authError", flashMessage);
        throw redirect(redirectTo, {
          headers: { "Set-Cookie": await commitAuthSession(session) },
        });
      }

      const sprints = await sprintService.getAll({ projectId });

      const sprintContext: SprintTypeContext[] = (sprints ?? []).map(
        (s: any) => ({
          id: s.id,
          name: s.name,
        }),
      );

      context.set(projectContext, {
        project,
        sprints: sprintContext,
      });

      return;
    } catch (err) {
      console.error("projectMiddleware error:", err);

      session.flash("authError", flashMessage);
      throw redirect(redirectTo, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }
  };
}
