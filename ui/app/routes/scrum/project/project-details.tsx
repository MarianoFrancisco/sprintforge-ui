// routes/scrum/project/by-id/project-details.tsx
import {
  type LoaderFunctionArgs,
  type MiddlewareFunction,
  useLoaderData,
  useNavigate,
} from "react-router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { ProjectResultResponseDTO } from "~/types/scrum/project";
import { projectService } from "~/services/scrum/project-service";
import { EmployeeChip } from "~/components/scrum/project/employee-chip";

// Si ya tienes middleware de proyecto/permiso en el layout, puedes omitir esto.
// Lo dejo vacío para que lo conectes si lo necesitas.
export const middleware: MiddlewareFunction[] = [];

type LoaderData = {
  project: ProjectResultResponseDTO;
};

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const { projectId } = params;
  if (!projectId) throw new Error("projectId no proporcionado");

  const project = await projectService.getById(projectId);
  return { project };
}

function formatMoney(value: number) {
  // Ajusta moneda/locale a tu gusto
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProjectDetailsRoute() {
  const { project } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  return (
    <Dialog open onOpenChange={(open) => (!open ? navigate("..") : null)}>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalles del proyecto
            <Badge variant="secondary" className="rounded-md">
              {project.projectKey}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Información general y empleados asignados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Key</p>
              <p className="font-medium">{project.projectKey}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Área</p>
              <Badge className="w-fit">{project.area}</Badge>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Nombre</p>
              <p className="font-medium">{project.name}</p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Descripción</p>
              <p className="whitespace-pre-wrap break-words">
                {project.description?.trim() ? project.description : "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="font-medium">{project.client}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Presupuesto</p>
              <p className="font-medium">{formatMoney(project.budgetAmount)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Contrato</p>
              <p className="font-medium">
                {formatMoney(project.contractAmount)}
              </p>
            </div>
          </div>

          {/* Empleados */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Empleados asignados</p>
              <p className="text-xs text-muted-foreground">
                {project.employees?.length ?? 0} empleados
              </p>
            </div>

            {project.employees?.length ? (
              <div className="flex flex-wrap gap-2">
                {project.employees.map((e) => (
                  <EmployeeChip
                    key={e.id}
                    employee={{
                      id: e.id,
                      email: e.email,
                      fullName: e.fullName,
                      profileImage: e.profileImage ?? null,
                    }}
                    showRemoveButton={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay empleados asignados.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => navigate("..")}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
