// ~/components/board/board-column.tsx
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { BoardColumnUI } from "~/types/scrum/board-column";
import { SortableWorkItem } from "./sortable-work-item";
import { useNavigate, useRouteLoaderData } from "react-router";
import type {loader as BoardLayout} from "~/layouts/board-layout"
import { ColumnActions } from "./column-actions";

interface BoardColumnProps {
  column: BoardColumnUI;
}

export function BoardColumn({ column }: BoardColumnProps) {
  const itemIds = column.items.map((i) => i.id);
  const data = useRouteLoaderData<typeof BoardLayout>("layouts/board-layout");
  const {project, sprintId } =data!;
  
  const navigate = useNavigate();

  return (
    <Card className="w-[320px] shrink-0 rounded-2xl">
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold">{column.name}</p>
            <p className="text-xs text-muted-foreground">
              {column.items.length} items
            </p>
          </div>
          <div className="text-xs text-muted-foreground">#{column.position}</div>
          <div className="shrink-0">
            <ColumnActions
              column={{
                id: column.id,
              }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-3">
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {column.items.map((item) => (
              <SortableWorkItem key={item.id} item={item} columnId={column.id} />
            ))}
          </div>
        </SortableContext>

        <Button
          type="button"
          variant="secondary"
          className="mt-3 w-full justify-center gap-2 rounded-xl"
          onClick={() => {navigate("/projects/" + project.id + "/work-items/create/" + sprintId + "/" + column.id)}}
        >
          <PlusIcon className="h-4 w-4" />
          Agregar historia
        </Button>
      </CardContent>
    </Card>
  );
}
