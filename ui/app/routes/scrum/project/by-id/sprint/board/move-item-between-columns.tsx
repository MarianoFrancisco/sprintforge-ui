// ~/routes/scrum/project/by-id/sprint/board/move-item-between-columns.tsx
import { redirect, type ActionFunctionArgs } from "react-router";
import { requireIdentity } from "~/auth.server";
import { workItemService } from "~/services/scrum/work-item-service";
import type { MoveWorkItemsBetweenBoardColumnsRequestDTO } from "~/types/scrum/work-item";

export async function action({ request, params }: ActionFunctionArgs) {
  console.log("MoveItemBetweenColumns action called");

  const identity = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  });

  const { projectId, sprintId, itemId, targetColumnId, targetPosition } = params;

  if (!projectId || !sprintId || !itemId || !targetColumnId || !targetPosition) {
    return redirect("/");
  }

  try {
    const payload: MoveWorkItemsBetweenBoardColumnsRequestDTO = {
      employeeId: identity.employeeId,
      sprintId,
      targetBoardColumnId: targetColumnId,
      targetPosition: Number(targetPosition),
      ids: [itemId],
    };

    await workItemService.moveBetweenColumns(payload);
  } catch (error) {
    console.error("Error al mover item entre columnas:", error);
    // Intencionalmente no propagamos el error
  }

  // Siempre regresamos al tablero del sprint
  return redirect(`/projects/${projectId}/board/${sprintId}`);
}

export default function MoveItemBetweenColumns() {
  return null;
}
