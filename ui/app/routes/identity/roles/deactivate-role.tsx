// routes/identity/roles/activate-role.tsx
import {
  type ActionFunctionArgs,
  type MiddlewareFunction,
  redirect,
} from "react-router";
import { toast } from "sonner";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";

import { roleService } from "~/services/identity/role-service";

export function meta() {
  return [{ title: "Desactivar rol" }];
}
export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.ROLE_VIEW, PERMS.ROLE_DEACTIVATE], {
    flashMessage: "No tienes permiso para desactivar Roles."
  }),
];

// Action: petición POST para activar el rol
export async function action({ params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del rol no proporcionado");

  try {
    await roleService.deactivate(id);
    toast.success("Rol desactivado correctamente");
    return redirect("/identity/roles");
  } catch (error: any) {
    throw redirect("/identity/roles");
  }
}

export default function DeactivateRolePage() {
    return null;
}
