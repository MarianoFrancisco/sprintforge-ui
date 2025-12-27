import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Loader2, Save } from "lucide-react";

import type { EmployeeResponseDTO } from "~/types/employees/employee";
import type { RoleResponseDTO } from "~/types/identity/role";
import { Combobox } from "~/components/common/combobox-option";

interface ChangeUserRoleFormProps {
  employee: EmployeeResponseDTO;
  currentRole: RoleResponseDTO;
  roles: RoleResponseDTO[];
}

export function ChangeUserRoleForm({
  employee,
  currentRole,
  roles,
}: ChangeUserRoleFormProps) {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [roleId, setRoleId] = useState<string>(currentRole.id);

  const roleOptions = roles
    .filter((r) => r.isActive && !r.isDeleted)
    .map((r) => ({
      value: r.id,
      label: r.name,
    }));

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form method="post" className="space-y-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Cambiar rol de usuario
              </h2>
              <p className="text-sm text-muted-foreground">
                Selecciona un nuevo rol para el empleado
              </p>
            </div>

            {/* EMPLEADO */}
            <div className="space-y-2">
              <Label>Empleado</Label>
              <Input value={employee.fullName} disabled />
            </div>

            {/* CUI */}
            <div className="space-y-2">
              <Label>CUI</Label>
              <Input value={employee.cui} disabled />
            </div>

            {/* ROL */}
            <div className="space-y-2">
              <Label>Rol</Label>
              <Combobox
                options={roleOptions}
                value={roleId}
                onChange={setRoleId}
                placeholder="Selecciona un rol"
              />
              {actionData?.errors?.roleId && (
                <p className="text-sm text-red-500">
                  {actionData.errors.roleId}
                </p>
              )}
            </div>

            {/* valor enviado al action */}
            <input type="hidden" name="roleId" value={roleId} />

            {/* BOTÓN */}
            <div className="flex items-center justify-end gap-3 pt-4">
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
                    Cambiar rol
                  </>
                )}
              </Button>
            </div>

            {actionData?.error && (
              <p className="text-sm text-red-500 text-center">
                {actionData.error}
              </p>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
