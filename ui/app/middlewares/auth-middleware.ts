// ~/middlewares/auth-middleware.ts
import { redirect, type LoaderFunctionArgs } from "react-router";
import { requireIdentity } from "~/auth.server";
import { userContext } from "~/context/user-context";
import { userProjectsContext } from "~/context/user-project-context";
import { authService } from "~/services/identity/auth-service";
import { projectService } from "~/services/scrum/project-service";
import { destroyAuthSession, getAuthSession } from "~/sessions.server";

export const authMiddleware = async ({ context, request }: LoaderFunctionArgs) => {
  const { userId, employeeId } = await requireIdentity(request, {
    redirectTo: "/login",
    flashMessage: "Necesitas iniciar sesión.",
  });

  try {
    const user = await authService.getCurrentUser(userId);

    // Si tu servicio puede devolver null/undefined en vez de throw:
    if (!user) {
      await logoutAndRedirect(request, {
        redirectTo: "/",
        flashMessage: "No se pudo validar tu sesión. Inicia sesión nuevamente.",
      });
    }

    context.set(userContext, user);

    const projects = await projectService.getActiveByEmployeeId(employeeId);
    context.set(userProjectsContext, projects || []);
  } catch (err) {
    await logoutAndRedirect(request, {
      redirectTo: "/",
      flashMessage: "No se pudo validar tu sesión. Inicia sesión nuevamente.",
    });
  }
};

async function logoutAndRedirect(
  request: Request,
  opts?: { redirectTo?: string; flashMessage?: string }
): Promise<never> {
  const session = await getAuthSession(request);

  if (opts?.flashMessage) {
    session.flash("error", opts.flashMessage);
  } else {
    session.flash("error", "Tu sesión expiró. Inicia sesión nuevamente.");
  }

  throw redirect(opts?.redirectTo ?? "/", {
    headers: { "Set-Cookie": await destroyAuthSession(session) },
  });
}