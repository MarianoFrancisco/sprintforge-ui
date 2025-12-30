// ~/components/board/board.tsx
import * as React from "react";
import { useFetcher } from "react-router";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableBoardColumn } from "./sortable-board-column";
import type { BoardColumnUI } from "~/types/scrum/board-column";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface BoardProps {
  boardColumns: BoardColumnUI[];
}

function findColumnByItemId(columns: BoardColumnUI[], itemId: string) {
  return columns.find((c) => c.items.some((i) => i.id === itemId));
}

export function Board({ boardColumns }: BoardProps) {
  const moveColumnFetcher = useFetcher();
  const moveItemFetcher = useFetcher();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const columnIds = boardColumns.map((c) => c.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type as "column" | "item" | undefined;
    const overType = over.data.current?.type as "column" | "item" | undefined;

    // =========================
    // 1) MOVIMIENTO DE COLUMNAS
    // =========================
    if (activeType === "column" && overType === "column") {
      if (active.id === over.id) return;

      const columnId = String(active.id);
      const oldIndex = boardColumns.findIndex((c) => c.id === columnId);
      const newIndex = boardColumns.findIndex((c) => c.id === String(over.id));

      if (oldIndex < 0 || newIndex < 0) return;

      moveColumnFetcher.submit(null, {
        method: "post",
        action: `move-column/${columnId}/${newIndex}`,
      });

      return;
    }

    // =========================
    // 2) MOVIMIENTO DE ITEMS
    // =========================
    if (activeType === "item") {
      const itemId = String(active.id);
      const overId = String(over.id);

      const fromColumn = findColumnByItemId(boardColumns, itemId);
      if (!fromColumn) return;

      const toColumn =
        overType === "column"
          ? boardColumns.find((c) => c.id === overId)
          : findColumnByItemId(boardColumns, overId);

      if (!toColumn) return;

      // ---- A) MISMA COLUMNA
      if (fromColumn.id === toColumn.id) {
        const oldIndex = fromColumn.items.findIndex((i) => i.id === itemId);
        if (oldIndex < 0) return;

        let newIndex =
          overType === "item"
            ? fromColumn.items.findIndex((i) => i.id === overId)
            : fromColumn.items.length;

        if (newIndex < 0) return;

        // Ajuste para movimiento hacia abajo
        if (newIndex > oldIndex) newIndex -= 1;

        if (newIndex === oldIndex) return;

        moveItemFetcher.submit(null, {
          method: "post",
          action: `move-item-in-column/${itemId}/${newIndex}`,
        });

        return;
      }

      // ---- B) ENTRE COLUMNAS
      const toColumnId = toColumn.id;
      
      // Calcular posición en la nueva columna
      let newPosition = 0;
      
      if (overType === "item") {
        const overItemIndex = toColumn.items.findIndex((i) => i.id === overId);
        newPosition = overItemIndex >= 0 ? overItemIndex : toColumn.items.length;
      } else {
        // Soltó en la columna vacía
        newPosition = toColumn.items.length;
      }

      moveItemFetcher.submit(null, {
        method: "post",
        action: `move-item-between-columns/${itemId}/${toColumnId}/${newPosition}`,
      });

      return;
    }
  }

return (
  <div className="min-w-0 flex flex-col gap-3">
    <div className="flex items-center justify-between" />

    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
        {/* Contenedor con scroll horizontal */}
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex w-max gap-3 pr-4">
            {boardColumns.map((col) => (
              <SortableBoardColumn key={col.id} column={col} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </SortableContext>
    </DndContext>
  </div>
)

}