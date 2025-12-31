// routes/scrum/project/by-id/sprint/board/delete-column.tsx
import * as React from "react";
import {
  data,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  Form,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router";

import { requireIdentity } from "~/auth.server";
import { commitAuthSession, getAuthSession } from "~/sessions.server";
import { boardColumnService } from "~/services/scrum/board-column-service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Combobox, type ComboboxOption } from "~/components/common/combobox-option";

import type { BoardColumnResponseDTO } from "~/types/scrum/board-column";

export function meta() {
  return [{ title: "Eliminar columna" }];
}

type LoaderData = {
  projectId: string;
  sprintId: string;
  columnId: string;
  columns: BoardColumnResponseDTO[];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { projectId, sprintId, columnId } = params;
  if (!projectId) throw new Error("projectId no proporcionado");
  if (!sprintId) throw new Error("sprintId no proporcionado");
  if (!columnId) throw new Error("columnId no proporcionado");

  const columns = await boardColumnService.getAll({ sprintId });

  // Opcional: evitar que se seleccione a sí misma como target
  const filtered = columns.filter((c) => c.id !== columnId);

  return data<LoaderData>({
    projectId,
    sprintId,
    columnId,
    columns: filtered,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);

  const { projectId, sprintId, columnId } = params;
  if (!projectId) throw new Error("projectId no proporcionado");
  if (!sprintId) throw new Error("sprintId no proporcionado");
  if (!columnId) throw new Error("columnId no proporcionado");

  const formData = await request.formData();
  const targetBoardColumnId = String(formData.get("targetBoardColumnId") ?? "").trim();

  try {
    const identity = await requireIdentity(request, {
      redirectTo: "/",
      flashMessage: "Sesión no válida. Inicia sesión nuevamente.",
    });

    if (!targetBoardColumnId) {
      session.flash("error", "Selecciona una columna destino para mover las historias.");
      return redirect(`/projects/${projectId}/board/${sprintId}`, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }

    if (targetBoardColumnId === columnId) {
      session.flash("error", "La columna destino no puede ser la misma columna a eliminar.");
      return redirect(`/projects/${projectId}/board/${sprintId}`, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }

    await boardColumnService.delete(columnId, {
      employeeId: identity.employeeId,
      targetBoardColumnId,
    });

    session.flash("success", "Columna eliminada correctamente.");
  } catch (error: any) {
    session.flash(
      "error",
      error?.response?.detail || "Error al eliminar la columna."
    );
  }

  return redirect(`/projects/${projectId}/board/${sprintId}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

export default function DeleteColumnPage() {
  const { columns } = useLoaderData<typeof loader>() as LoaderData;
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

  const options = React.useMemo<ComboboxOption[]>(
    () => columns.map((c) => ({ value: c.id, label: c.name })),
    [columns]
  );

  const [target, setTarget] = React.useState("");

  function onClose() {
    try {
      navigate(-1);
    } catch {
      navigate("/");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Eliminar columna</DialogTitle>
        </DialogHeader>

        <Form method="post" className="space-y-4">
          <div className="space-y-2">
            <Label>Enviar historias a</Label>

            <Combobox
              options={options}
              value={target}
              onChange={setTarget}
              placeholder="Selecciona una columna destino"
            />

            {/* Campo real para el action */}
            <input type="hidden" name="targetBoardColumnId" value={target} />
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={!target}
          >
            Eliminar columna
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
