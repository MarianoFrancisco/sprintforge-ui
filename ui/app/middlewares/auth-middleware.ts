import type { LoaderFunctionArgs } from "react-router";
import { requireIdentity } from "~/auth.server";
import { userContext } from "~/context/user-context";
import { authService } from "~/services/identity/auth-service";

export const authMiddleware = async ({
  context,
  request,
}: LoaderFunctionArgs) => {
      const { userId } = await requireIdentity(request, {
        redirectTo: "/login",
        flashMessage: "Necesitas iniciar sesión.",
      });
  
      const user = await authService.getCurrentUser(userId);
      context.set(userContext, user);
};