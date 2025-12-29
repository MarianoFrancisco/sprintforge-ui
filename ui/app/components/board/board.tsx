// ~/components/board/board.tsx
import * as React from "react";
import { useFetcher } from "react-router";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { SortableBoardColumn } from "./sortable-board-column";
import type { BoardColumnUI } from "~/types/scrum/board-column";

interface BoardProps {
  boardColumns: BoardColumnUI[];
}

function findColumnByItemId(columns: BoardColumnUI[], itemId: string) {
  return columns.find((c) => c.items.some((i) => i.id === itemId));
}

export function Board({ boardColumns }: BoardProps) {
  const [columns, setColumns] = React.useState(boardColumns);
  React.useEffect(() => setColumns(boardColumns), [boardColumns]);

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  const moveColumnFetcher = useFetcher();
  const moveItemFetcher = useFetcher();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const columnIds = columns.map((c) => c.id);

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type as "column" | "item" | undefined;
    if (activeType !== "item") return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setColumns((prev) => {
      const fromColumn = findColumnByItemId(prev, activeId);
      if (!fromColumn) return prev;

      const overType = over.data.current?.type as "column" | "item" | undefined;

      const toColumn =
        overType === "column"
          ? prev.find((c) => c.id === overId)
          : findColumnByItemId(prev, overId);

      if (!toColumn) return prev;

      // Si sigues dentro de la misma columna, NO hacemos nada aquí
      // para no interferir con el placeholder/ordenamiento normal.
      if (fromColumn.id === toColumn.id) return prev;

      const fromIndex = fromColumn.items.findIndex((i) => i.id === activeId);
      if (fromIndex < 0) return prev;

      const movingItem = fromColumn.items[fromIndex];

      // índice destino
      const toIndex =
        overType === "item"
          ? toColumn.items.findIndex((i) => i.id === overId)
          : toColumn.items.length;

      // Remueve de origen (SIN re-map, SIN cambiar position)
      const newFromItems = fromColumn.items.filter((i) => i.id !== activeId);

      // Inserta en destino (SIN cambiar position)
      const newToItems = [
        ...toColumn.items.slice(0, toIndex),
        movingItem,
        ...toColumn.items.slice(toIndex),
      ];

      return prev.map((c) => {
        if (c.id === fromColumn.id) return { ...c, items: newFromItems };
        if (c.id === toColumn.id) return { ...c, items: newToItems };
        return c;
      });
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type as "column" | "item" | undefined;
    const overType = over.data.current?.type as "column" | "item" | undefined;

    // ...dentro de handleDragEnd

// =========================
// 1) COLUMNAS
// route("move-column/:columnId/:newPosition", ...)
// =========================
if (activeType === "column" && overType === "column") {
  if (active.id === over.id) return;

  const columnId = String(active.id);

  const oldIndex = columns.findIndex((c) => c.id === columnId);
  const newIndex = columns.findIndex((c) => c.id === String(over.id));
  if (oldIndex < 0 || newIndex < 0) return;

  const newPosition = newIndex; // ✅ 0-based

  setColumns((prev) => arrayMove(prev, oldIndex, newIndex));

  moveColumnFetcher.submit(null, {
    method: "post",
    action: `move-column/${columnId}/${newPosition}`,
  });

  return;
}

// =========================
// 2) ITEMS
// =========================
if (activeType === "item") {
  const itemId = String(active.id);

  const fromColumnId = active.data.current?.columnId as string | undefined;

  const toColumnId =
    (over.data.current?.columnId as string | undefined) ??
    (overType === "column" ? String(over.id) : undefined);

  if (!fromColumnId || !toColumnId) return;

  // ---- A) MISMA COLUMNA
  // route("move-item-in-column/:itemId/:newPosition", ...)
  if (fromColumnId === toColumnId) {
    const col = columns.find((c) => c.id === fromColumnId);
    if (!col) return;

    const oldIndex = col.items.findIndex((i) => i.id === itemId);
    if (oldIndex < 0) return;

    const overTypeLocal = over.data.current?.type as "column" | "item" | undefined;
    const overId = String(over.id);

    // Si soltó sobre un item -> índice de ese item
    // Si soltó sobre la columna -> al final (después del último)
    // OJO: como NO estamos aplicando setState aquí, "al final" para backend 0-based
    // suele ser col.items.length - 1 (última posición) cuando realmente se mueve dentro.
    // Para consistencia, calcula "desiredIndex" en términos de posición final:
    let desiredIndex =
      overTypeLocal === "item"
        ? col.items.findIndex((i) => i.id === overId)
        : col.items.length - 1;

    if (desiredIndex < 0) return;

    // Si el item se mueve hacia abajo dentro de la misma columna y estás “apuntando”
    // a un índice basado en la lista actual (que incluye el item), al removerlo el índice final baja 1.
    // Ajuste típico:
    if (desiredIndex > oldIndex) desiredIndex -= 1;

    if (desiredIndex === oldIndex) return;

    const newPosition = desiredIndex; // ✅ 0-based

    moveItemFetcher.submit(null, {
      method: "post",
      action: `move-item-in-column/${itemId}/${newPosition}`,
    });

    return;
  }

  const overTypeLocal = over.data.current?.type as "column" | "item" | undefined;
  const overId = String(over.id);

  const targetColumn = columns.find((c) => c.id === toColumnId);
  if (!targetColumn) return;

  const targetIndex =
    overTypeLocal === "item"
      ? targetColumn.items.findIndex((i) => i.id === overId)
      : targetColumn.items.length;

  const targetPosition = Math.max(0, targetIndex);

  moveItemFetcher.submit(null, {
    method: "post",
    action: `move-item-between-columns/${itemId}/${toColumnId}/${targetPosition}`,
  });

  return;
}

  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between"></div>

      {isClient ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {columns.map((col) => (
                <SortableBoardColumn key={col.id} column={col} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {/* SSR fallback */}
          {columns.map((col) => (
            <div key={col.id} className="w-[320px] shrink-0 opacity-95">
              <SortableBoardColumn column={col} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
