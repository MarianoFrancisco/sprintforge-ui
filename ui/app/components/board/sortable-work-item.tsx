// ~/components/board/sortable-work-item.tsx
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { BoardColumnItem } from "./board-column-item";
import type { BoardColumnItemUI } from "~/types/scrum/board-column";

export function SortableWorkItem({
  item,
  columnId,
}: {
  item: BoardColumnItemUI;
  columnId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.id,
      data: { type: "item", columnId },
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BoardColumnItem item={item} />
    </div>
  );
}
