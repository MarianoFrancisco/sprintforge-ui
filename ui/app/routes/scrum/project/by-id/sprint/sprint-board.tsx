// ~/routes/sprint-board.tsx
import { useLoaderData } from "react-router";
import { Board } from "~/components/board/board";
import type { BoardColumnUI } from "~/types/scrum/board-column";

export function meta() {
  return [{ title: "Sprint Board" }];
}

type SprintBoardLoaderData = {
  sprintId: string;
  sprintName: string;
  boardColumns: BoardColumnUI[];
};

export async function loader(): Promise<SprintBoardLoaderData> {
  // Dummy data (luego lo reemplazas por tu service)
  const now = "2024-06-01T12:00:00.000Z";

  const boardColumns: BoardColumnUI[] = [
    {
      id: "col-1",
      name: "Por hacer",
      position: 1,
      isFinal: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      items: [
        {
          id: "wi-1",
          position: 1,
          title: "Como usuario, quiero iniciar sesión",
          storyPoints: 3,
          priority: 4,
          isDeleted: false,
        },
        {
          id: "wi-2",
          position: 2,
          title: "Como admin, quiero crear roles",
          storyPoints: 5,
          priority: 5,
          isDeleted: false,
        },
        {
          id: "wi-3",
          position: 3,
          title: "Como usuario, quiero ver mi perfil",
          storyPoints: 2,
          priority: 2,
          isDeleted: false,
        },
      ],
    },
    {
      id: "col-2",
      name: "En progreso",
      position: 2,
      isFinal: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      items: [
        {
          id: "wi-4",
          position: 1,
          title: "Tablero estilo JIRA (DND)",
          storyPoints: 8,
          priority: 5,
          isDeleted: false,
        },
        {
          id: "wi-5",
          position: 2,
          title: "Historial de pagos del proyecto",
          storyPoints: 3,
          priority: 3,
          isDeleted: false,
        },
      ],
    },
    {
      id: "col-3",
      name: "En revisión",
      position: 3,
      isFinal: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      items: [
        {
          id: "wi-6",
          position: 1,
          title: "Middleware de permisos",
          storyPoints: 2,
          priority: 4,
          isDeleted: false,
        },
      ],
    },
    {
      id: "col-4",
      name: "Hecho",
      position: 4,
      isFinal: true,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      items: [
        // {
        //   id: "wi-7",
        //   position: 1,
        //   title: "Badge de prioridad",
        //   storyPoints: 1,
        //   priority: 1,
        //   isDeleted: false,
        // },
      ],
    },
  ];

  return {
    sprintId: "sprint-1",
    sprintName: "Sprint 1",
    boardColumns,
  };
}

export default function SprintBoardRoute() {
  const { sprintName, boardColumns } = useLoaderData() as SprintBoardLoaderData;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{sprintName}</h1>
        <p className="text-sm text-muted-foreground">Arrastra historias entre columnas</p>
      </div>

      <Board boardColumns={boardColumns} />
    </div>
  );
}
