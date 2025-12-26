// ~/components/filters/EmployeeFilter.tsx
import type { FilterConfig } from "~/types/filters";
import { GenericFilter } from "../filters/generic-filter";

const employeeFilters: FilterConfig[] = [
  {
    name: "position",
    label: "Cargo",
    type: "input",
    placeholder: "Buscar por cargo",
  },
  {
    name: "workloadType",
    label: "Tipo de jornada",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "FULL_TIME", label: "Tiempo completo" },
      { value: "PART_TIME", label: "Medio tiempo" },
    ],
    placeholder: "Selecciona tipo de jornada",
  },
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "ACTIVE", label: "Activo" },
      { value: "SUSPENDED", label: "Suspendido" },
      { value: "TERMINATED", label: "Terminado" },
    ],
    placeholder: "Selecciona estado",
  },
];

export function EmployeeFilter() {
  return (
    <GenericFilter
      filters={employeeFilters}
      searchPlaceholder="Buscar empleados..."
    />
  );
}