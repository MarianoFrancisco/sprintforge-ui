// ~/components/board/board.tsx
import * as React from "react";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
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

      // target column: si over es una columna, over.id es columnId
      // si over es item, buscamos su columna
      const overType = over.data.current?.type as "column" | "item" | undefined;

      const toColumn =
        overType === "column"
          ? prev.find((c) => c.id === overId)
          : findColumnByItemId(prev, overId);

      if (!toColumn) return prev;

      // Si sigues dentro de la misma columna, no hace falta nada aquí:
      // el placeholder ya lo maneja dnd-kit para reordenamiento.
      if (fromColumn.id === toColumn.id) return prev;

      const fromIndex = fromColumn.items.findIndex((i) => i.id === activeId);
      if (fromIndex < 0) return prev;

      const movingItem = fromColumn.items[fromIndex];

      // índice destino
      const toIndex =
        overType === "item"
          ? toColumn.items.findIndex((i) => i.id === overId)
          : toColumn.items.length;

      // remueve de origen
      const newFromItems = fromColumn.items
        .filter((i) => i.id !== activeId)
        .map((it, idx) => ({ ...it, position: idx + 1 }));

      // inserta en destino (esto crea el “hueco” visual)
      const newToItems = [
        ...toColumn.items.slice(0, toIndex),
        { ...movingItem, position: 0 },
        ...toColumn.items.slice(toIndex),
      ].map((it, idx) => ({ ...it, position: idx + 1 }));

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

    // Reordenar columnas
    if (activeType === "column" && overType === "column") {
      if (active.id === over.id) return;

      setColumns((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === active.id);
        const newIndex = prev.findIndex((c) => c.id === over.id);
        return arrayMove(prev, oldIndex, newIndex).map((c, idx) => ({
          ...c,
          position: idx + 1,
        }));
      });

      // aquí luego llamarás a action de mover columna
      return;
    }

    // Reordenar items dentro de misma columna:
    // (si se movió entre columnas, ya lo reflejamos en onDragOver,
    // aquí solo dejamos listo para que luego hagas submit al backend)
    if (activeType === "item") {
      const activeId = String(active.id);

      const fromColumnId = active.data.current?.columnId as string | undefined;

      const toColumnId =
        (over.data.current?.columnId as string | undefined) ??
        (overType === "column" ? (over.id as string) : undefined);

      // aquí luego decides qué action llamar según from/to
      console.log("persist move", { activeId, fromColumnId, toColumnId });
      return;
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold">Tablero</p>
        <Button type="button" className="gap-2 rounded-xl">
          <PlusIcon className="h-4 w-4" />
          Agregar columna
        </Button>
      </div>

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
