// ~/components/scrum/sprints/create-sprint-form.tsx
import { useEffect, useMemo, useRef, useState } from "react"
import { Form, useActionData, useNavigation } from "react-router"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Button } from "~/components/ui/button"
import { Loader2, RotateCcw, Save } from "lucide-react"

import type { CreateSprintRequestDTO } from "~/types/scrum/sprint"

interface CreateSprintFormProps {
  defaultValues?: Partial<CreateSprintRequestDTO>
}

export function CreateSprintForm({ defaultValues }: CreateSprintFormProps) {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const formRef = useRef<HTMLFormElement | null>(null)

  const [key, setKey] = useState(0)

  const initialStart = useMemo(() => defaultValues?.startDate ?? "", [defaultValues?.startDate])
  const initialEnd = useMemo(() => defaultValues?.endDate ?? "", [defaultValues?.endDate])

  function handleReset() {
    formRef.current?.reset()
    setKey((k) => k + 1)
  }

  return (
    <Form
      key={key}
      ref={formRef}
      method="post"
      className="space-y-5"
    >
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Crear sprint</h2>
        <p className="text-sm text-muted-foreground">
          Define nombre, meta y rango de fechas
        </p>
      </div>

      {/* Grid responsive */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* NOMBRE */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ej: Sprint 12"
            defaultValue={defaultValues?.name ?? ""}
            required
            maxLength={120}
          />
          {actionData?.errors?.name && (
            <p className="text-sm text-red-500">{actionData.errors.name}</p>
          )}
        </div>

        {/* FECHA INICIO */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de inicio</Label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            defaultValue={initialStart}
            required
          />
          {actionData?.errors?.startDate && (
            <p className="text-sm text-red-500">{actionData.errors.startDate}</p>
          )}
        </div>

        {/* FECHA FIN */}
        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha de fin</Label>
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={initialEnd}
            required
          />
          {actionData?.errors?.endDate && (
            <p className="text-sm text-red-500">{actionData.errors.endDate}</p>
          )}
        </div>

        {/* META */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="goal">Meta (opcional)</Label>
          <Textarea
            id="goal"
            name="goal"
            placeholder="¿Qué se busca lograr en este sprint?"
            className="min-h-[110px]"
            defaultValue={defaultValues?.goal ?? ""}
            maxLength={500}
          />
          {actionData?.errors?.goal && (
            <p className="text-sm text-red-500">{actionData.errors.goal}</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Limpiar
        </Button>

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
              Crear sprint
            </>
          )}
        </Button>
      </div>
    </Form>
  )
}
