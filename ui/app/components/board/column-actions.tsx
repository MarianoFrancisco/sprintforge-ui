// ~/components/scrum/board/column-actions.tsx
import { Form, useNavigate, useParams } from "react-router";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";

interface ColumnActionsProps {
  column: {id: string};
}

export function ColumnActions({ column }: ColumnActionsProps) {
  const navigate = useNavigate();
  const { projectId, sprintId } = useParams();

  if (!projectId || !sprintId) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted text-muted-foreground"
        >
          <Ellipsis />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {/* Renombrar */}
        <DropdownMenuItem
          onClick={() =>
            navigate(
              `/projects/${projectId}/board/${sprintId}/column/rename/${column.id}`
            )
          }
        >
          <Pencil className="mr-2 h-4 w-4" />
          Renombrar
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Eliminar */}
        <Form
          method="get"
          action={`/projects/${projectId}/board/${sprintId}/column/delete/${column.id}`}
        >
          <DropdownMenuItem variant="destructive" asChild>
            <button
              type="submit"
              className="flex w-full items-center text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </button>
          </DropdownMenuItem>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
