// ~/components/board/sortable-board-column.tsx
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { BoardColumn } from "./board-column";
import type { BoardColumnUI } from "~/types/scrum/board-column";

export function SortableBoardColumn({ column }: { column: BoardColumnUI }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
    data: { type: "column" },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BoardColumn column={column} />
    </div>
  );
}
