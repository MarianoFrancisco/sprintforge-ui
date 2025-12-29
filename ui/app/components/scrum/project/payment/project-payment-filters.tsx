// ~/components/projects/payments/project-payment-filters.tsx
import { GenericFilter } from "~/components/filters/generic-filter";
import type { FilterConfig } from "~/types/filters";
import type { ProjectResponseDTO } from "~/types/scrum/project";
import type { PaymentResponseDTO } from "~/types/scrum/project-payment";

export type PaymentMethod = "CASH" | "TRANSFER";

interface ProjectPaymentFiltersProps {
  payments: PaymentResponseDTO[];
}

/**
 * Construye opciones únicas de proyectos a partir del arreglo de pagos.
 * (Sin depender de que te pasen proyectos por separado)
 */
function buildProjectOptionsFromPayments(payments: PaymentResponseDTO[]) {
  const map = new Map<string, ProjectResponseDTO>();

  for (const p of payments) {
    if (p.project?.id) {
      map.set(p.project.id, p.project);
    }
  }

  // Ordena por projectKey luego por nombre
  return Array.from(map.values())
    .sort((a, b) => {
      const ka = a.projectKey ?? "";
      const kb = b.projectKey ?? "";
      const keyCmp = ka.localeCompare(kb);
      if (keyCmp !== 0) return keyCmp;
      return (a.name ?? "").localeCompare(b.name ?? "");
    })
    .map((proj) => ({
      value: proj.id,
      label: `${proj.projectKey} — ${proj.name}`,
    }));
}

const methodOptions = [
  { value: "CASH", label: "Efectivo" },
  { value: "TRANSFER", label: "Transferencia" },
] as const;

export function ProjectPaymentFilters({ payments }: ProjectPaymentFiltersProps) {
  const projectOptions = buildProjectOptionsFromPayments(payments);

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
      options: methodOptions as any, // si tu FilterConfig no tipa "as const", puedes quitar esto ajustando types
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

  return (
    <GenericFilter
      filters={projectPaymentFilters}
      searchPlaceholder="Buscar por KEY, nombre del proyecto o cliente"
    />
  );
}
