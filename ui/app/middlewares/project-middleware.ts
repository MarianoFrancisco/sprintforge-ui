// ~/middlewares/project-middleware.ts
import { redirect, type LoaderFunctionArgs } from "react-router";
import { projectContext } from "~/context/project-context";
import { projectService } from "~/services/scrum/project-service";
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
    
    // Se asume que authMiddleware ya corrió (si necesitas validar user aquí, lo puedes hacer)
    const projectId =
      (paramKey ? params[paramKey] : undefined) ?? params.projectId;

    if (!projectId) {
      const session = await getAuthSession(request);
      session.flash("authError", "Falta el identificador del proyecto.");
      throw redirect(redirectTo, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }

    try {
      const project = await projectService.getById(projectId);

      // Si tu servicio devuelve null en lugar de throw:
      if (!project) {
        const session = await getAuthSession(request);
        session.flash("authError", flashMessage);
        throw redirect(redirectTo, {
          headers: { "Set-Cookie": await commitAuthSession(session) },
        });
      }

      context.set(projectContext, project);
      return;
    } catch (err) {
      // Log interno
      console.error("projectMiddleware error:", err);

      // Flash + redirect
      const session = await getAuthSession(request);
      session.flash("authError", flashMessage);

      throw redirect(redirectTo, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }
  };
}
