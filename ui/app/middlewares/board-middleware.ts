// ~/middlewares/board-middleware.ts
import { redirect, type LoaderFunctionArgs } from "react-router";
import { boardContext, type BoardTypeContext } from "~/context/board-context";
import { projectContext } from "~/context/project-context";
import { getAuthSession, commitAuthSession } from "~/sessions.server";

import { workItemService } from "~/services/scrum/work-item-service";
import { boardColumnService } from "~/services/scrum/board-column-service";
import { mergeBoardColumnsWithWorkItems } from "~/lib/merge-board-columns";

type BoardMiddlewareOptions = {
  redirectTo?: string;
  flashMessage?: string;
  /** Param que contiene el sprintId (por defecto "sprintId") */
  sprintParamKey?: string;
};

export function boardMiddleware(opts: BoardMiddlewareOptions = {}) {
  const {
    redirectTo = "/",
    flashMessage = "No se pudo cargar el tablero.",
    sprintParamKey = "sprintId",
  } = opts;

  return async ({ context, request, params }: LoaderFunctionArgs) => {
    const session = await getAuthSession(request);

    try {
      // 1) Asume que projectMiddleware ya corrió y dejó ProjectTypeContext
      const projectCtx = context.get(projectContext) as
        | { project: { id: string } }
        | null
        | undefined;

      if (!projectCtx?.project?.id) {
        session.flash("authError", "No hay proyecto cargado en el contexto.");
        throw redirect(redirectTo, {
          headers: { "Set-Cookie": await commitAuthSession(session) },
        });
      }

      // 2) sprintId desde params
      const sprintId = (params[sprintParamKey] ?? params.sprintId) as
        | string
        | undefined;

      if (!sprintId) {
        session.flash(
          "authError",
          "Sprint no existe o no tiene permiso para verlo.",
        );
        throw redirect(redirectTo, {
          headers: { "Set-Cookie": await commitAuthSession(session) },
        });
      }

      // 3) Obtener work-items por sprintId
      const workItems = await workItemService.getAll({ projectId: projectCtx.project.id, sprintId });

      // 4) Obtener board-columns por sprintId
      const boardColumns = await boardColumnService.getAll({ sprintId });

      // 5) Merge (si no hay columnas -> helper devuelve [])
      const boardColumnsUI = mergeBoardColumnsWithWorkItems(
        workItems ?? [],
        boardColumns ?? [],
      );

      // 6) Setear contexto (sprints ya no se setean aquí)
      const boardCtx: BoardTypeContext = {
        boardColumns: boardColumnsUI,
      };

      context.set(boardContext, boardCtx);
      return;
    } catch (err) {
      console.error("boardMiddleware error:", err);

      session.flash("authError", flashMessage);
      throw redirect(redirectTo, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }
  };
}
