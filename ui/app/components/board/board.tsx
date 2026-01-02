// ~/components/board/board.tsx
import * as React from "react";
import { useFetcher } from "react-router";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
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

function removeItemFromColumn(columns: BoardColumnUI[], itemId: string) {
  for (const col of columns) {
    const idx = col.items.findIndex((i) => i.id === itemId);
    if (idx >= 0) {
      const item = col.items[idx];
      const next = columns.map((c) =>
        c.id === col.id ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      );
      return { next, removedFromColumnId: col.id, item };
    }
  }
  return { next: columns, removedFromColumnId: null as string | null, item: null as any };
}

function insertItemIntoColumn(
  columns: BoardColumnUI[],
  columnId: string,
  item: any,
  index: number
) {
  return columns.map((c) => {
    if (c.id !== columnId) return c;
    const safeIndex = Math.max(0, Math.min(index, c.items.length));
    const items = [...c.items];
    items.splice(safeIndex, 0, item);
    return { ...c, items };
  });
}

export function Board({ boardColumns }: BoardProps) {
  const moveColumnFetcher = useFetcher();
  const moveItemFetcher = useFetcher();

  const [columnsState, setColumnsState] = React.useState<BoardColumnUI[]>(boardColumns);

  // Sync con loader (cuando backend redirige y trae data nueva)
  React.useEffect(() => {
    setColumnsState(boardColumns);
  }, [boardColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const columnIds = columnsState.map((c) => c.id);

  // Guardamos el origen real (antes del preview)
  const dragMetaRef = React.useRef<{
    activeItemId?: string;
    fromColumnId?: string;
  }>({});

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeType = active.data.current?.type as "column" | "item" | undefined;

    if (activeType === "item") {
      const itemId = String(active.id);
      const from = findColumnByItemId(columnsState, itemId);
      dragMetaRef.current = {
        activeItemId: itemId,
        fromColumnId: from?.id,
      };
    } else {
      dragMetaRef.current = {};
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type as "column" | "item" | undefined;
    if (activeType !== "item") return;

    const itemId = String(active.id);
    const overId = String(over.id);
    const overType = over.data.current?.type as "column" | "item" | undefined;

    setColumnsState((prev) => {
      const fromColumn = findColumnByItemId(prev, itemId);
      if (!fromColumn) return prev;

      const toColumn =
        overType === "column"
          ? prev.find((c) => c.id === overId)
          : findColumnByItemId(prev, overId);

      if (!toColumn) return prev;

      // índice destino (en la columna objetivo)
      let newIndex = 0;
      if (overType === "item") {
        const idx = toColumn.items.findIndex((i) => i.id === overId);
        newIndex = idx >= 0 ? idx : toColumn.items.length;
      } else {
        newIndex = toColumn.items.length;
      }

      // --- Misma columna: solo reordenar
      if (fromColumn.id === toColumn.id) {
        const oldIndex = fromColumn.items.findIndex((i) => i.id === itemId);
        if (oldIndex < 0) return prev;
        if (newIndex > oldIndex) newIndex -= 1; // mismo ajuste que ya tienes
        if (oldIndex === newIndex) return prev;

        return prev.map((c) =>
          c.id === fromColumn.id
            ? { ...c, items: arrayMove(c.items, oldIndex, newIndex) }
            : c
        );
      }

      // --- Entre columnas: sacar de origen e insertar en destino
      const { next: removed, item } = removeItemFromColumn(prev, itemId);
      if (!item) return prev;

      // Si el item ya “estaba” en destino por un over anterior, evita duplicados
      const removedAgain = removed.map((c) => ({
        ...c,
        items: c.items.filter((i) => i.id !== itemId),
      }));

      return insertItemIntoColumn(removedAgain, toColumn.id, item, newIndex);
    });
  }

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

      // Origen real (antes del preview)
      const originalFromColumnId = dragMetaRef.current.fromColumnId;
      const originalFrom =
        originalFromColumnId
          ? columnsState.find((c) => c.id === originalFromColumnId)
          : findColumnByItemId(boardColumns, itemId);

      if (!originalFrom) return;

      // Destino final según el estado “preview” (columnsState)
      const finalTo = findColumnByItemId(columnsState, itemId);
      if (!finalTo) return;

      // Índice final en la columna destino (en el estado preview)
      const finalIndex = finalTo.items.findIndex((i) => i.id === itemId);
      if (finalIndex < 0) return;

      // ---- A) MISMA COLUMNA
      if (originalFrom.id === finalTo.id) {
        // Calcula oldIndex con data original (boardColumns, no preview)
        const fromOriginal = boardColumns.find((c) => c.id === originalFrom.id);
        if (!fromOriginal) return;

        const oldIndex = fromOriginal.items.findIndex((i) => i.id === itemId);
        if (oldIndex < 0) return;

        // Ajuste para movimiento hacia abajo (mismo criterio que ya usas)
        let newIndex = finalIndex;
        if (newIndex > oldIndex) newIndex -= 1;
        if (newIndex === oldIndex) return;

        moveItemFetcher.submit(null, {
          method: "post",
          action: `move-item-in-column/${itemId}/${newIndex}`,
        });

        return;
      }

      // ---- B) ENTRE COLUMNAS
      moveItemFetcher.submit(null, {
        method: "post",
        action: `move-item-between-columns/${itemId}/${finalTo.id}/${finalIndex}`,
      });

      return;
    }
  }

  return (
    <div className="min-w-0 flex flex-col gap-3">
      <div className="flex items-center justify-between" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex w-max gap-3 pr-4">
              {columnsState.map((col) => (
                <SortableBoardColumn key={col.id} column={col} />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </SortableContext>
      </DndContext>
    </div>
  );
}
