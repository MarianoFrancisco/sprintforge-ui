// app/components/project/project-form.tsx
"use client"

import * as React from "react"
import { Form, useActionData, useNavigation } from "react-router"
import { Loader2, Save, RotateCcw } from "lucide-react"

import { Card, CardContent } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"

import type { EmployeeResponseDTO } from "~/types/employees/employee"
import { EmployeeSelector } from "./employee-selector"

type ActionData =
  | { error?: string; success?: string; errors?: Record<string, string> }
  | undefined

interface ProjectFormProps {
  employees: EmployeeResponseDTO[]
  defaultValues?: Partial<{
    projectKey: string
    name: string
    description?: string
    client: string
    area: string
    budgetAmount: string
    contractAmount: string
    employeeIds: string[]
  }>
}

function suggestKey(name: string) {
  const cleaned = name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9 ]/g, "")
  const letters = cleaned.replace(/\s/g, "")
  return letters.slice(0, 3).toUpperCase()
}

export function ProjectForm({ employees, defaultValues }: ProjectFormProps) {
  const actionData = useActionData() as ActionData
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const isKeyManuallyEditedRef = React.useRef(false)

  const [name, setName] = React.useState(defaultValues?.name ?? "")
  const [projectKey, setProjectKey] = React.useState(defaultValues?.projectKey ?? "")
  const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>(
    defaultValues?.employeeIds ?? []
  )

  React.useEffect(() => {
    if (isKeyManuallyEditedRef.current) return
    if (!name.trim()) {
      setProjectKey("")
      return
    }
    const next = suggestKey(name)
    if (next && next !== projectKey) setProjectKey(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  function handleClear() {
    if (isSubmitting) return

    isKeyManuallyEditedRef.current = false
    setName(defaultValues?.name ?? "")
    setProjectKey(defaultValues?.projectKey ?? "")
    setSelectedEmployees(defaultValues?.employeeIds ?? [])

    // Limpia también inputs uncontrolled (defaultValue) usando el DOM
    // (cliente, área, montos, descripción)
    const form = document.querySelector("form") as HTMLFormElement | null
    form?.reset()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card
        className="
          border-0 shadow-none rounded-none bg-transparent
          sm:border sm:shadow-sm sm:rounded-xl sm:bg-card
        "
      >
        <CardContent className="p-0 sm:p-6">
          <Form method="post" className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Crear Proyecto</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Key */}
              <div className="space-y-2">
                <Label htmlFor="projectKey">Clave (Key)</Label>
                <Input
                  id="projectKey"
                  name="projectKey"
                  type="text"
                  maxLength={10}
                  placeholder="Ej. IMP"
                  value={projectKey}
                  onChange={(e) => {
                    isKeyManuallyEditedRef.current = true
                    setProjectKey(e.target.value.toUpperCase())
                  }}
                />
                <p className="text-xs text-muted-foreground">Sugerida automáticamente. Puedes cambiarla.</p>
                {actionData?.errors?.projectKey && (
                  <p className="text-sm text-red-500">{actionData.errors.projectKey}</p>
                )}
              </div>

              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  maxLength={50}
                  placeholder="Ej. Implementación ERP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {actionData?.errors?.name && (
                  <p className="text-sm text-red-500">{actionData.errors.name}</p>
                )}
              </div>

              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  name="client"
                  type="text"
                  maxLength={100}
                  placeholder="Ej. ACME Corp"
                  defaultValue={defaultValues?.client ?? ""}
                />
                {actionData?.errors?.client && (
                  <p className="text-sm text-red-500">{actionData.errors.client}</p>
                )}
              </div>

              {/* Área */}
              <div className="space-y-2">
                <Label htmlFor="area">Área</Label>
                <Input
                  id="area"
                  name="area"
                  type="text"
                  maxLength={80}
                  placeholder="Ej. Tecnología"
                  defaultValue={defaultValues?.area ?? ""}
                />
                {actionData?.errors?.area && (
                  <p className="text-sm text-red-500">{actionData.errors.area}</p>
                )}
              </div>

              {/* Presupuesto */}
              <div className="space-y-2">
                <Label htmlFor="budgetAmount">Presupuesto</Label>
                <Input
                  id="budgetAmount"
                  name="budgetAmount"
                  type="number"
                  min={0}
                  step={0.01}
                  inputMode="decimal"
                  placeholder="0.00"
                  defaultValue={defaultValues?.budgetAmount ?? ""}
                />
                {actionData?.errors?.budgetAmount && (
                  <p className="text-sm text-red-500">{actionData.errors.budgetAmount}</p>
                )}
              </div>

              {/* Monto contrato */}
              <div className="space-y-2">
                <Label htmlFor="contractAmount">Monto contrato</Label>
                <Input
                  id="contractAmount"
                  name="contractAmount"
                  type="number"
                  min={0}
                  step={0.01}
                  inputMode="decimal"
                  placeholder="0.00"
                  defaultValue={defaultValues?.contractAmount ?? ""}
                />
                {actionData?.errors?.contractAmount && (
                  <p className="text-sm text-red-500">{actionData.errors.contractAmount}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  maxLength={255}
                  placeholder="Descripción breve del proyecto"
                  defaultValue={defaultValues?.description ?? ""}
                  className="min-h-[100px]"
                />
                {actionData?.errors?.description && (
                  <p className="text-sm text-red-500">{actionData.errors.description}</p>
                )}
              </div>

              {/* Empleados */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="font-semibold">Empleados asignados</Label>
                <EmployeeSelector
                  employees={employees}
                  selected={selectedEmployees}
                  onChange={setSelectedEmployees}
                />
                {actionData?.errors?.employeeIds && (
                  <p className="text-sm text-red-500">{actionData.errors.employeeIds}</p>
                )}
              </div>
            </div>

            <input type="hidden" name="employeeIds" value={JSON.stringify(selectedEmployees)} />

            {/* Acciones */}
            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Limpiar
              </Button>

              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Crear Proyecto
                  </>
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
