import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";
import { Loader2, Save } from "lucide-react";
import type { PayEmployeeRequestDTO } from "~/types/employees/employee-payment";

interface EmployeePaymentFormProps {
  defaultValues?: Partial<PayEmployeeRequestDTO>;
}

export function EmployeePaymentForm({ defaultValues }: EmployeePaymentFormProps) {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigation = useNavigation();
  const [submitted, setSubmitted] = useState(false);

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form method="post" onSubmit={() => setSubmitted(true)} className="space-y-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">Realizar Pago</h2>
              <p className="text-sm text-muted-foreground">Completa los datos del pago</p>
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={defaultValues?.date ?? ""}
                required
              />
              {actionData?.errors?.date && (
                <p className="text-sm text-destructive">{actionData.errors.date}</p>
              )}
            </div>

            {/* Bono */}
            <div className="space-y-2">
              <Label htmlFor="bonus">Bono</Label>
              <Input
                id="bonus"
                name="bonus"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                placeholder="0.00"
                defaultValue={defaultValues?.bonus ?? ""}
              />
              {actionData?.errors?.bonus && (
                <p className="text-sm text-destructive">{actionData.errors.bonus}</p>
              )}
            </div>

            {/* Descuento */}
            <div className="space-y-2">
              <Label htmlFor="deduction">Descuento</Label>
              <Input
                id="deduction"
                name="deduction"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                placeholder="0.00"
                defaultValue={defaultValues?.deduction ?? ""}
              />
              {actionData?.errors?.deduction && (
                <p className="text-sm text-destructive">{actionData.errors.deduction}</p>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                name="notes"
                maxLength={255}
                placeholder="Notas del pago (opcional)"
                defaultValue={defaultValues?.notes ?? ""}
              />
              {actionData?.errors?.notes && (
                <p className="text-sm text-destructive">{actionData.errors.notes}</p>
              )}
            </div>

            {/* Botón */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Pagando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Realizar pago
                  </>
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
