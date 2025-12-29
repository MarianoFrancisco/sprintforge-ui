// ~/routes/sprint-board.tsx
import { redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { Board } from "~/components/board/board";
import type { BoardColumnUI } from "~/types/scrum/board-column";
import { boardContext } from "~/context/board-context";
import { projectContext } from "~/context/project-context";

export function meta() {
  return [{ title: "Sprint Board" }];
}

type SprintBoardLoaderData = {
  sprintId: string;
  sprintName: string;
  boardColumns: BoardColumnUI[];
};

export async function loader({ context, params }: LoaderFunctionArgs): Promise<SprintBoardLoaderData> {
  const projectCtx = context.get(projectContext);
  const boardCtx = context.get(boardContext);

  if (!projectCtx || !boardCtx) throw redirect("/");

  const sprintId = params.sprintId;
  if (!sprintId) throw redirect("/");

  const sprint = projectCtx.sprints.find((s) => s.id === sprintId);
  if (!sprint) throw redirect("/");

  return {
    sprintId,
    sprintName: sprint.name,
    boardColumns: boardCtx.boardColumns ?? [],
  };
}

export default function SprintBoardRoute() {
  const { sprintName, boardColumns } = useLoaderData() as SprintBoardLoaderData;

  return (
      <Board boardColumns={boardColumns} />
  );
}
