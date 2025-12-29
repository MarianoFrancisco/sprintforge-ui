// ~/components/filters/EmployeePaymentsFilter.tsx
import { GenericFilter } from "~/components/filters/generic-filter";
import type { FilterConfig } from "~/types/filters";

const employeePaymentsFilters: FilterConfig[] = [
  {
    name: "position",
    label: "Cargo",
    type: "input",
    placeholder: "Ej: Gerente, Analista",
  },
  {
    name: "fromDate",
    label: "Fecha desde",
    type: "date",
    placeholder: "YYYY-MM-DD",
  },
  {
    name: "toDate",
    label: "Fecha hasta",
    type: "date",
    placeholder: "YYYY-MM-DD",
  },
];

export function EmployeePaymentsFilter() {
  return (
    <GenericFilter
      filters={employeePaymentsFilters}
      searchPlaceholder="Buscar por CUI o nombre del empleado"
    />
  );
}