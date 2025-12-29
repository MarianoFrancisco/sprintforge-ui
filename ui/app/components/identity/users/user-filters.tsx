import { GenericFilter } from "~/components/filters/generic-filter";
import type { FilterConfig } from "~/types/filters";

const userFilters: FilterConfig[] = [
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "ACTIVE", label: "Activo" },
      { value: "LOCKED", label: "Bloqueado" },
      { value: "DISABLED", label: "Deshabilitado" },
      { value: "PENDING_ACTIVATION", label: "Pendiente de activación" },
    ],
    placeholder: "Selecciona estado",
  },
];

export function UserFilter() {
  return (
    <GenericFilter
      filters={userFilters}
      searchPlaceholder="Buscar usuarios por usuario o email"
    />
  );
}
