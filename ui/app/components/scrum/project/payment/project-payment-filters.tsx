// ~/components/projects/payments/project-payment-filters.tsx
import { GenericFilter } from "~/components/filters/generic-filter"
import type { FilterConfig } from "~/types/filters"
import type { ProjectResponseDTO } from "~/types/scrum/project"

export type PaymentMethod = "CASH" | "TRANSFER"

interface ProjectPaymentFiltersProps {
  projects: ProjectResponseDTO[]
}

function buildProjectOptions(projects: ProjectResponseDTO[]) {
  return projects
    .map((p) => ({
      value: p.id,
      label: p.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

const methodOptions = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
] as const

export function ProjectPaymentFilters({ projects }: ProjectPaymentFiltersProps) {
  const projectOptions = buildProjectOptions(projects)

  const projectPaymentFilters: FilterConfig[] = [
    {
      name: "projectId",
      label: "Proyecto",
      type: "combobox",
      placeholder: "Buscar proyecto...",
      options: projectOptions,
    },
    {
      name: "method",
      label: "Método",
      type: "select",
      placeholder: "Selecciona método",
      options: methodOptions as any,
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
  ]

  return (
    <GenericFilter
      filters={projectPaymentFilters}
      searchPlaceholder="Buscar por nombre del proyecto"
    />
  )
}
