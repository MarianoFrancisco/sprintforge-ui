// ~/components/filters/EmploymentHistoryFilter.tsx
import { GenericFilter } from "~/components/filters/generic-filter";
import type { FilterConfig } from "~/types/filters";

const employmentHistoryFilters: FilterConfig[] = [
  {
    name: "position",
    label: "Cargo",
    type: "input",
    placeholder: "Ej: Gerente, Analista",
  },
  {
    name: "type",
    label: "Tipo",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "HIRING", label: "Contratación" },
      { value: "SALARY_INCREASE", label: "Aumento salarial" },
      { value: "SUSPENSION", label: "Suspensión" },
      { value: "REINSTATEMENT", label: "Reincorporación" },
      { value: "TERMINATION", label: "Terminación" },
    ],
    placeholder: "Selecciona tipo",
  },
  {
    name: "startDateFrom",
    label: "Fecha desde",
    type: "date",
    placeholder: "YYYY-MM-DD",
  },
  {
    name: "startDateTo",
    label: "Fecha hasta",
    type: "date",
    placeholder: "YYYY-MM-DD",
  },
];

export function EmploymentHistoryFilter() {
  return (
    <GenericFilter
      filters={employmentHistoryFilters}
      searchPlaceholder="Buscar por CUI o nombre del empleado"
    />
  );
}