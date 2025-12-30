// routes/identity/roles/activate-role.tsx
import {
  type ActionFunctionArgs,
  redirect,
} from "react-router";

import { roleService } from "~/services/identity/role-service";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta() {
  return [{ title: "Activar rol" }];
}

// Action: petición POST para activar el rol
export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);
  const { id } = params;
  if (!id) throw new Error("ID del rol no proporcionado");
  try {
    await roleService.activate(id);
    session.flash("success", "Rol activado correctamente.");
  } catch (error: any) {
    session.flash("error", error?.response?.detail || "Error al activar el rol.");
  }
  return redirect("/identity/roles", {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
}

export default function ActivateRolePage() {
    return null;
}
