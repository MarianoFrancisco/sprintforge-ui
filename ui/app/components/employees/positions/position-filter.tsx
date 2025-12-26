// ~/components/filters/PositionFilter.tsx
import { GenericFilter } from "~/components/filters/generic-filter";
import type { FilterConfig } from "~/types/filters";

const positionFilters: FilterConfig[] = [
  {
    name: "isActive",
    label: "Estado",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "true", label: "Activos" },
      { value: "false", label: "Inactivos" },
    ],
    placeholder: "Selecciona el estado",
  },
  {
    name: "isDeleted",
    label: "Eliminados",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "true", label: "Eliminados" },
      { value: "false", label: "No eliminados" },
    ],
    placeholder: "Selecciona una opción",
  },
];

export function PositionFilter() {
  return (
    <GenericFilter
      filters={positionFilters}
      searchPlaceholder="Buscar puestos..."
    />
  );
}