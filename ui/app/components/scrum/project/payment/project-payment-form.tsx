// ~/components/projects/project-payment-form.tsx
import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2, Save, RotateCcw } from "lucide-react";
import type { PaymentMethod } from "~/types/scrum/project-payment";

export interface ProjectPaymentRequestDTO {
  date: string;
  amount: string;
  method: PaymentMethod;
  reference?: string;
  note?: string;
}

interface ProjectPaymentFormProps {
  defaultValues?: Partial<ProjectPaymentRequestDTO>;
}

export function ProjectPaymentForm({ defaultValues }: ProjectPaymentFormProps) {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const formRef = useRef<HTMLFormElement>(null);

  const [method, setMethod] = useState<PaymentMethod>(
    defaultValues?.method ?? "CASH"
  );

  useEffect(() => {
    setMethod(defaultValues?.method ?? "CASH");
  }, [defaultValues?.method]);

  const handleClear = () => {
    formRef.current?.reset();
    setMethod(defaultValues?.method ?? "CASH");
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form ref={formRef} method="post" className="space-y-5">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Registrar pago del proyecto
              </h2>
              <p className="text-sm text-muted-foreground">
                Completa la información del pago
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Fecha */}
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={defaultValues?.date ?? ""}
                />
                {actionData?.errors?.date && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.date}
                  </p>
                )}
              </div>

              {/* Monto */}
              <div className="space-y-2">
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  required
                  defaultValue={defaultValues?.amount ?? ""}
                />
                {actionData?.errors?.amount && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.amount}
                  </p>
                )}
              </div>

              {/* Método de pago */}
              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Select
                  name="method"
                  value={method}
                  onValueChange={(value) =>
                    setMethod(value as PaymentMethod)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
                {actionData?.errors?.method && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.method}
                  </p>
                )}
              </div>

              {/* Referencia (solo si es transferencia) */}
              {method === "TRANSFER" && (
                <div className="space-y-2">
                  <Label htmlFor="reference">
                    Referencia de transferencia
                  </Label>
                  <Input
                    id="reference"
                    name="reference"
                    placeholder="REF-0123456"
                    defaultValue={defaultValues?.reference ?? ""}
                  />
                  {actionData?.errors?.reference && (
                    <p className="text-sm text-destructive">
                      {actionData.errors.reference}
                    </p>
                  )}
                </div>
              )}

              {/* Nota (2 columnas) */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="note">Nota</Label>
                <Textarea
                  id="note"
                  name="note"
                  maxLength={255}
                  placeholder="Nota adicional (opcional)"
                  defaultValue={defaultValues?.note ?? ""}
                />
                {actionData?.errors?.note && (
                  <p className="text-sm text-destructive">
                    {actionData.errors.note}
                  </p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
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
                    Registrar pago
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
