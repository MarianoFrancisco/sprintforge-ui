import { Form, useActionData, useNavigation } from "react-router"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Loader2, Save } from "lucide-react"

interface BoardColumnFormProps {
  defaultName?: string
}

export function BoardColumnForm({ defaultName }: BoardColumnFormProps) {
  const actionData = useActionData() as
    | { errors?: Record<string, string> }
    | undefined

  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  return (
    <Form method="post" className="space-y-4">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ej: En progreso"
          defaultValue={defaultName ?? ""}
          required
        />
        {actionData?.errors?.name && (
          <p className="text-sm text-destructive">
            {actionData.errors.name}
          </p>
        )}
      </div>

      {/* Botón */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Crear columna
            </>
          )}
        </Button>
      </div>
    </Form>
  )
}
