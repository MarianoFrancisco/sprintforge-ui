// ~/components/scrum/work-items/create-user-story-form.tsx
import { useMemo, useState } from "react"
import { Form, useActionData, useNavigation } from "react-router"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { Loader2, Save } from "lucide-react"

import type { CreateWorkItemRequestDTO } from "~/types/scrum/work-item"
import { EmployeeCombobox } from "~/components/common/employee-combobox"
import type { EmployeeResultResponseDTO } from "~/types/scrum/project"

interface CreateUserStoryFormProps {
  employees: EmployeeResultResponseDTO[]
  defaultValues?: Partial<CreateWorkItemRequestDTO>
}

export function CreateUserStoryForm({
  employees,
  defaultValues,
}: CreateUserStoryFormProps) {
  const actionData = useActionData() as
    | { errors?: Record<string, string> }
    | undefined

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  // State controlado para combobox
  const [developerId, setDeveloperId] = useState<string | null>(
    defaultValues?.developerId ?? null
  )
  const [productOwnerId, setProductOwnerId] = useState<string | null>(
    defaultValues?.productOwnerId ?? null
  )

  // State opcional para priority (si querés controlarlo)
  const [priority, setPriority] = useState<number>(
    defaultValues?.priority ?? 1
  )

  const employeesActive = useMemo(() => {
    // si tienes flags isActive/isDeleted filtra aquí; por ahora, usa todos
    console.log(employees)
    return employees
  }, [employees])

  return (
          <Form method="post" className="space-y-5">
            {/* Header */}
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Crear historia de usuario
              </h2>
              <p className="text-sm text-muted-foreground">
                Completa la información y asigna responsables si aplica
              </p>
            </div>

            {/* Grid responsive */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* TÍTULO */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Como usuario, quiero..."
                  defaultValue={defaultValues?.title ?? ""}
                  required
                />
                {actionData?.errors?.title && (
                  <p className="text-sm text-destructive">{actionData.errors.title}</p>
                )}
              </div>

              {/* PRIORIDAD */}
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  required
                />
                {actionData?.errors?.priority && (
                  <p className="text-sm text-destructive">{actionData.errors.priority}</p>
                )}
              </div>

              {/* STORY POINTS */}
              <div className="space-y-2">
                <Label htmlFor="storyPoints">Story points</Label>
                <Input
                  id="storyPoints"
                  name="storyPoints"
                  type="number"
                  min={0}
                  step={1}
                  defaultValue={
                    defaultValues?.storyPoints === null ||
                    defaultValues?.storyPoints === undefined
                      ? ""
                      : defaultValues.storyPoints
                  }
                  placeholder="Opcional"
                />
                {actionData?.errors?.storyPoints && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.storyPoints}
                  </p>
                )}
              </div>

              {/* DESCRIPCIÓN */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe el alcance o contexto..."
                  className="min-h-[110px]"
                  defaultValue={defaultValues?.description ?? ""}
                />
                {actionData?.errors?.description && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.description}
                  </p>
                )}
              </div>

              {/* CRITERIOS DE ACEPTACIÓN */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="acceptanceCriteria">Criterios de aceptación</Label>
                <Textarea
                  id="acceptanceCriteria"
                  name="acceptanceCriteria"
                  placeholder="Ej: Dado que..., cuando..., entonces..."
                  className="min-h-[110px]"
                  defaultValue={defaultValues?.acceptanceCriteria ?? ""}
                />
                {actionData?.errors?.acceptanceCriteria && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.acceptanceCriteria}
                  </p>
                )}
              </div>

              {/* DEV */}
              <div className="space-y-2">
                <Label>Developer (opcional)</Label>
                <EmployeeCombobox
                  employees={employeesActive}
                  value={developerId}
                  onChange={setDeveloperId}
                  placeholder="Selecciona un developer"
                  clearable
                />
                {actionData?.errors?.developerId && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.developerId}
                  </p>
                )}
              </div>

              {/* PO */}
              <div className="space-y-2">
                <Label>Product Owner (opcional)</Label>
                <EmployeeCombobox
                  employees={employeesActive}
                  value={productOwnerId}
                  onChange={setProductOwnerId}
                  placeholder="Selecciona un product owner"
                  clearable
                />
                {actionData?.errors?.productOwnerId && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.productOwnerId}
                  </p>
                )}
              </div>
            </div>

            {/* Hidden inputs para mandar al action */}
            <input type="hidden" name="developerId" value={developerId ?? ""} />
            <input
              type="hidden"
              name="productOwnerId"
              value={productOwnerId ?? ""}
            />

            {/* Botón */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Crear historia
                  </>
                )}
              </Button>
            </div>
          </Form>
  )
}
