import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Combobox, type ComboboxOption } from "~/components/common/combobox-option";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";

import type { EmployeeResponseDTO } from "~/types/employees/employee";
import type { PositionResponseDTO } from "~/types/employees/position";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

interface EmployeeFormProps {
  positions: PositionResponseDTO[];
  employee?: EmployeeResponseDTO;
}

export function EmployeeForm({ positions, employee }: EmployeeFormProps) {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigation = useNavigation();
  const [submitted, setSubmitted] = useState(false);
  const isSubmitting = navigation.state === "submitting";

  // Combobox state
  const [selectedPosition, setSelectedPosition] = useState<string>(employee?.positionId ?? "");

  // Convertimos a ComboboxOption
  const positionOptions: ComboboxOption[] = positions.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const isRehire = !!employee;

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <Card className="@container">
        <CardContent className="p-6">
          <Form method="post" encType="multipart/form-data" onSubmit={() => setSubmitted(true)} className="space-y-6">

            <h2 className="text-2xl font-semibold tracking-tight text-center">
              {isRehire ? "Recontratar empleado" : "Contratar empleado"}
            </h2>

            {/* ID oculto solo en recontratación */}
            {isRehire && <input type="hidden" name="id" value={employee.id} />}

            {/* Campos PERSONALES — no requeridos en rehire */}

            <Separator/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cui">CUI</Label>
                <Input id="cui" name="cui" defaultValue={employee?.cui ?? ""} disabled={isRehire} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={employee?.email ?? ""} disabled={isRehire} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" name="firstName" defaultValue={employee?.firstName ?? ""} disabled={isRehire} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" name="lastName" defaultValue={employee?.lastName ?? ""} disabled={isRehire} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Teléfono</Label>
                <Input id="phoneNumber" name="phoneNumber" defaultValue={employee?.phoneNumber ?? ""} disabled={isRehire} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                <Input id="birthDate" name="birthDate" type="date" defaultValue={employee?.birthDate ?? ""} disabled={isRehire} />
              </div>
            </div>


            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="positionId">Puesto</Label>
              <input type="hidden" name="positionId" value={selectedPosition} />
              <Combobox
                options={positionOptions}
                value={selectedPosition}
                onChange={setSelectedPosition}
                placeholder="Selecciona un puesto"
              />
            </div>

            {/* WorkloadType */}
            <div className="space-y-2">
              <Label htmlFor="workloadType">Tipo de jornada</Label>

              <Select
                name="workloadType"
                defaultValue={employee?.workloadType ?? ""}
              >
                <SelectTrigger id="workloadType" className="w-full">
                  <SelectValue placeholder="Seleccionar tipo de jornada" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="FULL_TIME">Tiempo completo</SelectItem>
                  <SelectItem value="PART_TIME">Medio tiempo</SelectItem>
                  <SelectItem value="TEMPORARY">Temporal</SelectItem>
                </SelectContent>
              </Select>
            </div>


            {/* Salary / IGSS / IRTRA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salary">Salario</Label>
                <Input id="salary" name="salary" defaultValue={employee?.salary ?? ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="igssPercentage">IGSS (%)</Label>
                <Input id="igssPercentage" name="igssPercentage" defaultValue={employee?.igssPercentage ?? ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="irtraPercentage">IRTRA (%)</Label>
                <Input id="irtraPercentage" name="irtraPercentage" defaultValue={employee?.irtraPercentage ?? ""} />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input id="startDate" name="startDate" type="date" />
            </div>

            {/* File upload */}
            <div className="space-y-2">
              <Label htmlFor="profileImage">Foto de perfil</Label>
              <Input id="profileImage" name="profileImage" type="file" accept="image/*" />
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" name="notes" placeholder="Notas o comentarios (opcional)" maxLength={250} />
            </div>

            {/* Botón */}
            <div className="flex items-center justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRehire ? "Recontratando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isRehire ? "Recontratar" : "Contratar"}
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
