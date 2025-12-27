// routes/identity/roles/activate-role.tsx
import {
  type ActionFunctionArgs,
  redirect,
} from "react-router";
import { toast } from "sonner";

import { roleService } from "~/services/identity/role-service";

export function meta() {
  return [{ title: "Desactivar rol" }];
}

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
