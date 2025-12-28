// ~/components/projects/project-card.tsx
import { Card, CardHeader, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { ProjectResponseDTO, ProjectResultResponseDTO } from "~/types/scrum/project";
import { formatGTQ } from "~/util/currency-formatter";

interface ProjectCardProps {
  project: ProjectResultResponseDTO;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const assignedCount = project.employees.length;

  return (
    <Card className="w-full max-w-md flex flex-col justify-between">
      {/* Header */}
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Project key */}
          <Badge variant="outline" className="text-xs">
            {project.projectKey}
          </Badge>

          {/* Area */}
          <Badge variant="secondary" className="text-xs">
            {project.area}
          </Badge>

          {/* Assigned people */}
          <Badge variant="outline" className="text-xs">
            {assignedCount}{" "}
            {assignedCount === 1 ? "persona" : "personas"}
          </Badge>
        </div>

        {/* Project name */}
        <h2 className="text-xl font-semibold leading-tight">
          {project.name}
        </h2>

        {/* Client */}
        <p className="text-sm text-muted-foreground">
          Cliente:{" "}
          <span className="font-medium text-foreground">
            {project.client}
          </span>
        </p>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-4">
        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Presupuesto</p>
            <p className="text-lg font-semibold">
              {formatGTQ(project.budgetAmount)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">Contrato</p>
            <p className="text-lg font-semibold">
              {formatGTQ(project.contractAmount)}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-end">
        {project.isClosed ? (
          <Badge variant="destructive">Cerrado</Badge>
        ) : (
          <Badge>Activo</Badge>
        )}
      </CardFooter>
    </Card>
  );
}
