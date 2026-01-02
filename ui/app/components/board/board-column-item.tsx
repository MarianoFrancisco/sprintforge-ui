// ~/components/board/board-column-item.tsx
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { BoardColumnItemUI } from "~/types/scrum/board-column";
import { PriorityBadge } from "../scrum/work-item/priority-badge";
import { useRouteLoaderData } from "react-router";
import type { loader as BoardLayout } from "~/layouts/board-layout";

import { BoardColumnItemActions } from "./board-column-item-actions";
import { truncateText } from "~/lib/truncate-text";

const TITLE_MAX_CHARS = 50;

interface BoardColumnItemProps {
  item: BoardColumnItemUI;
}

export function BoardColumnItem({ item }: BoardColumnItemProps) {
  const data = useRouteLoaderData<typeof BoardLayout>("layouts/board-layout");
  const { project } = data!;

  const title = truncateText(item.title, TITLE_MAX_CHARS);

  return (
    <Card className="rounded-xl">
      {/* HEADER: prioridad + acciones */}
      <CardHeader className="py-2 px-3">
        <div className="flex items-center">
          <PriorityBadge priority={item.priority} />
          <div className="ml-auto shrink-0">
            <BoardColumnItemActions item={item} projectId={project.id} />
          </div>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="px-3 pb-3 pt-0 space-y-2">
        {/* TÍTULO: nunca se sale */}
        <p
          className="
            text-sm font-medium leading-snug
            whitespace-normal
            break-all
            min-w-0
          "
          title={item.title}
        >
          {title}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>SP: {item.storyPoints ?? "—"}</span>
          <span># {item.position}</span>
        </div>
      </CardContent>
    </Card>
  );
}
