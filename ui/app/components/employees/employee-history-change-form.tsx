import { useState } from "react";
import { Form } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import type { EmploymentHistoryType } from "~/types/employees/employment-history";
import { Textarea } from "../ui/textarea";

interface EmployeeHistoryChangeFormProps {
  type: EmploymentHistoryType;
}

interface FormState {
  date: string;
  notes?: string;
  increaseAmount?: number;
}

export function EmployeeHistoryChangeForm({ type }: EmployeeHistoryChangeFormProps) {
  const initialState: FormState = {
    date: "",
    notes: "",
    increaseAmount: type === "SALARY_INCREASE" ? 0 : undefined,
  };

  const [form, setForm] = useState<FormState>(initialState);

  const updateField = (field: keyof FormState, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setForm(initialState);

  return (
      <Form method="post">
        <Card>
          <CardContent className="space-y-4">
            {/* Fecha */}
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
            {/* Solo SALARY_INCREASE */}
            {type === "SALARY_INCREASE" && (
              <div className="space-y-2">
                <Label>Monto de aumento</Label>
                <Input
                  type="number"
                  value={form.increaseAmount}
                  onChange={(e) => updateField("increaseAmount", Number(e.target.value))}
                  min={0}
                  step={0.01}
                />
              </div>
            )}
            {/* Notas */}
            <div className="space-y-2">
              <Label>Notas</Label>
              <Textarea
                value={form.notes}
                rows={5}
                maxLength={100}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={resetForm}>
                Limpiar
              </Button>
              <Button type="submit">
                {type === 'SALARY_INCREASE'
                        ? 'Aumentar'
                        : type === 'SUSPENSION'
                        ? 'Suspender'
                        : type === 'REINSTATEMENT'
                        ? 'Reincorporar'
                        : type === 'TERMINATION'
                        ? 'Terminar'
                        : 'Guardar'
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Serialización HTML para el backend */}
        <input type="hidden" name="date" value={form.date} />
        <input type="hidden" name="notes" value={form.notes} />
        {type === "SALARY_INCREASE" && (
          <input type="hidden" name="increaseAmount" value={form.increaseAmount} />
        )}
      </Form>
    
  );
}
