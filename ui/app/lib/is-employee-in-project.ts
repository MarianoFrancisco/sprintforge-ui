// ~/lib/projects/is-employee-in-project.ts

import type { EmployeeResultResponseDTO, ProjectResultResponseDTO } from "~/types/scrum/project";

/**
 * Valida si un empleado pertenece a un proyecto
 *
 * @param project Proyecto con su lista de empleados
 * @param employeeId ID del empleado a validar
 * @returns true si el empleado está dentro del proyecto, false en caso contrario
 */
export function isEmployeeInProject(
  project: ProjectResultResponseDTO,
  employeeId: string
): boolean {
  if (!employeeId) return false;
  if (!project?.employees?.length) return false;

  return project.employees.some(
    (employee: EmployeeResultResponseDTO) => employee.id === employeeId
  );
}
