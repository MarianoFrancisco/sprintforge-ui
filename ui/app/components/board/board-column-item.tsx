// ~/components/board/board-column-item.tsx
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { BoardColumnItemUI } from "~/types/scrum/board-column";
import { PriorityBadge } from "../scrum/work-item/priority-badge";
import { useRouteLoaderData } from "react-router";
import type { loader as BoardLayout } from "~/layouts/board-layout";

import { BoardColumnItemActions } from "./board-column-item-actions";

interface BoardColumnItemProps {
  item: BoardColumnItemUI;
}

export function BoardColumnItem({ item }: BoardColumnItemProps) {
  const data = useRouteLoaderData<typeof BoardLayout>("layouts/board-layout");
  const { project } = data!;

  return (
    <Card className="rounded-xl">
      <CardHeader className="py-2 px-3">
        <div className="flex items-start justify-between gap-2">
          {/* Título */}
          <p className="text-sm font-medium leading-snug flex-1">
            {item.title}
          </p>

          {/* Acciones + prioridad */}
          <div className="flex items-center gap-1">
            <PriorityBadge priority={item.priority} />
            <BoardColumnItemActions
              item={item}
              projectId={project.id}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>SP: {item.storyPoints ?? "—"}</span>
          <span># {item.position}</span>
        </div>
      </CardContent>
    </Card>
  );
}
