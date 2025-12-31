// routes/scrum/project/by-id/sprint/board/rename-column.tsx
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
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export function meta() {
  return [{ title: "Renombrar columna" }];
}

type LoaderData = {
  projectId: string;
  sprintId: string;
  columnId: string;
  columnName: string;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { projectId, sprintId, columnId } = params;
  if (!projectId) throw new Error("projectId no proporcionado");
  if (!sprintId) throw new Error("sprintId no proporcionado");
  if (!columnId) throw new Error("columnId no proporcionado");

  const column = await boardColumnService.getById(columnId);

  return data<LoaderData>({
    projectId,
    sprintId,
    columnId,
    columnName: column.name,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);

  const { projectId, sprintId, columnId } = params;
  if (!projectId) throw new Error("projectId no proporcionado");
  if (!sprintId) throw new Error("sprintId no proporcionado");
  if (!columnId) throw new Error("columnId no proporcionado");

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();

  try {
    const identity = await requireIdentity(request, {
      redirectTo: "/",
      flashMessage: "Sesión no válida. Inicia sesión nuevamente.",
    });

    if (!name) {
      session.flash("error", "El nombre de la columna es obligatorio.");
      return redirect(`/projects/${projectId}/board/${sprintId}`, {
        headers: { "Set-Cookie": await commitAuthSession(session) },
      });
    }

    await boardColumnService.updateName(columnId, {
      employeeId: identity.employeeId,
      name,
    });

    session.flash("success", "Columna renombrada correctamente.");
  } catch (error: any) {
    session.flash(
      "error",
      error?.response?.detail || "Error al renombrar la columna."
    );
  }

  return redirect(`/projects/${projectId}/board/${sprintId}`, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

export default function RenameColumnRoute() {
  const { columnName } = useLoaderData<typeof loader>() as LoaderData;
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

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
          <DialogTitle>Renombrar columna</DialogTitle>
        </DialogHeader>

        <Form method="post" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              defaultValue={columnName}
              maxLength={60}
              autoFocus
              placeholder="Nombre de la columna"
            />
          </div>

          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
