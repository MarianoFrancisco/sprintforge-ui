// ~/routes/scrum/project/by-id/sprint/board/move-column.tsx
import { redirect, type ActionFunctionArgs } from "react-router";
import { requireIdentity } from "~/auth.server";
import { boardColumnService } from "~/services/scrum/board-column-service";
import type { MoveBoardColumnRequestDTO } from "~/types/scrum/board-column";

export async function action({ request, params }: ActionFunctionArgs) {
  console.log("MoveColumn action called", params);

  const identity = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  });

  // Los params deberían incluir projectId y sprintId desde la ruta
  const { projectId, sprintId, columnId, newPosition } = params;

  console.log("Params:", { projectId, sprintId, columnId, newPosition });

  if (!projectId || !sprintId || !columnId || newPosition == null) {
    console.error("Faltan parámetros:", { projectId, sprintId, columnId, newPosition });
    return redirect("/");
  }

  const parsedPosition = Number(newPosition);
  if (Number.isNaN(parsedPosition)) {
    return redirect(`/projects/${projectId}/board/${sprintId}`);
  }

  try {
    const payload: MoveBoardColumnRequestDTO = {
      employeeId: identity.employeeId,
      columnId,
      newPosition: parsedPosition,
    };

    console.log("Moving column with payload:", payload);
    await boardColumnService.move(payload);
  } catch (error) {
    console.error("Error al mover columna:", error);
  }

  return redirect(`/projects/${projectId}/board/${sprintId}`);
}

export default function MoveColumn() {
  return null;
}