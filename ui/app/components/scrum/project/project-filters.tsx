// ~/components/filters/ProjectFilter.tsx
import { GenericFilter } from "~/components/filters/generic-filter"
import type { FilterConfig } from "~/types/filters"

const projectFilters: FilterConfig[] = [
  {
    name: "isClosed",
    label: "Estado",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "false", label: "Abiertos" },
      { value: "true", label: "Cerrados" },
    ],
    placeholder: "Selecciona estado",
  },
]

export function ProjectFilter() {
  return (
    <GenericFilter
      filters={projectFilters}
      searchPlaceholder="Buscar proyectos por key, nombre, cliente o área"
    />
  )
}
