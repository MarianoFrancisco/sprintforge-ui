// ~/components/filters/RoleFilter.tsx
import { GenericFilter } from "~/components/filters/generic-filter";
import type { FilterConfig } from "~/types/filters";

const roleFilters: FilterConfig[] = [
  {
    name: "isActive",
    label: "Estado",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "true", label: "Activos" },
      { value: "false", label: "Inactivos" },
    ],
    placeholder: "Selecciona estado",
  },
];

export function RoleFilter() {
  return (
    <GenericFilter
      filters={roleFilters}
      searchPlaceholder="Buscar roles por nombre o descripción"
    />
  );
}