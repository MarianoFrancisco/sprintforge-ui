// ~/middlewares/auth-middleware.ts
import { redirect, type LoaderFunctionArgs } from "react-router";
import { requireIdentity } from "~/auth.server";
import { userContext } from "~/context/user-context";
import { authService } from "~/services/identity/auth-service";
import { destroyAuthSession, getAuthSession } from "~/sessions.server";

export const authMiddleware = async ({ context, request }: LoaderFunctionArgs) => {
  const { userId } = await requireIdentity(request, {
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
    session.flash("authError", opts.flashMessage);
  } else {
    session.flash("authError", "Tu sesión expiró. Inicia sesión nuevamente.");
  }
  
  throw redirect(opts?.redirectTo ?? "/", {
    headers: { "Set-Cookie": await destroyAuthSession(session) },
  });
}