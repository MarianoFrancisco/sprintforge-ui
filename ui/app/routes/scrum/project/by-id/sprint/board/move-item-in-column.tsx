// ~/routes/scrum/project/by-id/sprint/board/move-item-in-column.tsx
import { redirect, type ActionFunctionArgs, type MiddlewareFunction } from "react-router";
import { requireIdentity } from "~/auth.server";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { workItemService } from "~/services/scrum/work-item-service";
import type { MoveWorkItemInBoardColumnRequestDTO } from "~/types/scrum/work-item";

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.WORK_ITEM_MOVE_IN_COLUMN], {
    flashMessage: "No tienes permiso para mover items dentro de la columna.",
  }),
];

export async function action({ request, params }: ActionFunctionArgs) {
    console.log("MoveItemInColumn action called");
  const identity = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  });

  const { projectId, sprintId, itemId, newPosition } = params;

  // Validaciones mínimas
  if (!projectId || !sprintId || !itemId || !newPosition) {
    return redirect("/");
  }

  try {
    const payload: MoveWorkItemInBoardColumnRequestDTO = {
      employeeId: identity.employeeId,
      newPosition: Number(newPosition),
    };

    await workItemService.moveInBoardColumn(itemId, payload);
  } catch (error) {
    console.error("Error al mover item dentro de la columna:", error);
    // Intencionalmente no propagamos el error
  }

  // Siempre regresamos al tablero del sprint
  return redirect(`/projects/${projectId}/board/${sprintId}`);
}

export default function MoveItemInColumn() {
  return null;
}
