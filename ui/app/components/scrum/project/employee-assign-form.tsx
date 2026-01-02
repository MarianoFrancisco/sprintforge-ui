// ~/components/employees/employee-assign-form.tsx
import * as React from "react"
import { Form } from "react-router"

import { Button } from "~/components/ui/button"
import type { EmployeeResponseDTO } from "~/types/employees/employee"
import { EmployeeSelector } from "./employee-selector"

interface EmployeeAssignFormProps {
  /** lista de empleados disponibles para seleccionar */
  employees: EmployeeResponseDTO[]

  /** name del campo que se enviará en el POST */
  fieldName?: string

  /** action del form (si lo usas dentro de un dialog/ruta específica) */
  action?: string

  /** deshabilita selector y botón */
  disabled?: boolean

  /** si quieres limitar a 1 selección (por ejemplo asignar developer/po) */
  maxSelected?: number

  /** texto del botón */
  submitLabel?: string

  className?: string
}

/**
 * Form reutilizable para asignar/desasignar empleados.
 * - Solo renderiza selector + botón Guardar
 * - Envía por POST un input hidden con los IDs seleccionados (CSV)
 */
export function EmployeeAssignForm({
  employees,
  fieldName = "employeeIds",
  action,
  disabled,
  maxSelected,
  submitLabel = "Guardar",
  className,
}: EmployeeAssignFormProps) {
  const [selected, setSelected] = React.useState<string[]>([])

  const serialized = selected.join(",")

  return (
    <Form method="post" action={action} className={className}>
      <input type="hidden" name={fieldName} value={serialized} />

      <EmployeeSelector
        employees={employees}
        selected={selected}
        onChange={setSelected}
        disabled={disabled}
        maxSelected={maxSelected}
      />

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={disabled || selected.length === 0}>
          {submitLabel}
        </Button>
      </div>
    </Form>
  )
}
