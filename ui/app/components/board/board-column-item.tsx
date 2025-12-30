// ~/components/board/board-column-item.tsx
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { BoardColumnItemUI } from "~/types/scrum/board-column";
import { PriorityBadge } from "../scrum/work-item/priority-badge";

interface BoardColumnItemProps {
  item: BoardColumnItemUI;
}

export function BoardColumnItem({ item }: BoardColumnItemProps) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="py-2 px-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{item.title}</p>
          <PriorityBadge priority={item.priority} />
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3 pt-0">
        <div className="text-xs text-muted-foreground flex items-center justify-between">
          <span>SP: {item.storyPoints ?? "—"}</span>
          <span># {item.position}</span>
        </div>
      </CardContent>
    </Card>
  );
}
