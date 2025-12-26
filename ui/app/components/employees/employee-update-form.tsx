import { useState, useRef } from "react";
import { Form } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

import { StepPersonal } from "./steps/step-personal";
import type { EmployeeResponseDTO } from "~/types/employees/employee";

interface EmployeeUpdateFormProps {
  employee: EmployeeResponseDTO;
}

const initialFormState = (employee: EmployeeResponseDTO) => ({
    cui: employee.cui,
  email: employee.email,
  firstName: employee.firstName,
  lastName: employee.lastName,
  phoneNumber: employee.phoneNumber,
  birthDate: employee.birthDate,
  profileImageUrl: employee.profileImage ?? "",
});

export function EmployeeUpdateForm({ employee }: EmployeeUpdateFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(() => initialFormState(employee));

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Form
        method="post"
        encType="multipart/form-data"
        className="space-y-6"
      >
        <Card>
          <CardContent className="p-6 space-y-4">
            <StepPersonal
              form={form}
              updateField={updateField}
              fileInputRef={fileInputRef}
              isEditMode={true}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit">
                Guardar cambios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Serialización HTML (solo campos permitidos por backend) */}
        <input type="hidden" name="firstName" value={form.firstName} />
        <input type="hidden" name="lastName" value={form.lastName} />
        <input type="hidden" name="phoneNumber" value={form.phoneNumber} />
        <input type="hidden" name="birthDate" value={form.birthDate} />

        {/* ÚNICO input file */}
        <input
          ref={fileInputRef}
          type="file"
          name="profileImage"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            updateField(
              "profileImageUrl",
              URL.createObjectURL(file)
            );
          }}
        />
      </Form>
    </div>
  );
}
