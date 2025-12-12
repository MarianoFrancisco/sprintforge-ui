// app/components/roles/role-form.tsx
"use client";

import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Loader2, Save } from "lucide-react";
import type { Permission } from "../permission/permission-selector";
import PermissionSelector from "../permission/permission-selector";

interface RoleFormProps {
  permissions: Permission[]; // lista total de permisos
  defaultRole?: {
    id?: string;
    name: string;
    description: string;
    isDefault: boolean;
    permissions: string[]; // ids seleccionados
  };
}

export function RoleForm({ permissions, defaultRole }: RoleFormProps) {
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isEditMode = !!defaultRole;

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    defaultRole?.permissions ?? []
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardContent className="p-6">
          <Form method="post" className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              {isEditMode ? "Editar Rol" : "Crear Rol"}
            </h2>

            {/* ID oculto para edición */}
            {isEditMode && <input type="hidden" name="id" value={defaultRole?.id} />}

            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                maxLength={100}
                placeholder="Ej. Administrador"
                defaultValue={defaultRole?.name ?? ""}
              />
              {actionData?.errors?.name && (
                <p className="text-sm text-red-500">{actionData.errors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                maxLength={255}
                placeholder="Descripción breve del rol"
                defaultValue={defaultRole?.description ?? ""}
              />
              {actionData?.errors?.description && (
                <p className="text-sm text-red-500">{actionData.errors.description}</p>
              )}
            </div>

            {/* isDefault */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="isDefault"
                name="isDefault"
                defaultChecked={defaultRole?.isDefault ?? false}
              />
              <Label htmlFor="isDefault">Rol predeterminado</Label>
            </div>

            {/* Selector de Permisos */}
            <div className="space-y-2">
              <Label className="font-semibold">Permisos</Label>
              <PermissionSelector
                permissions={permissions}
                selected={selectedPermissions}
                onChange={setSelectedPermissions}
              />
            </div>

            {/* Serialización de permisos seleccionados */}
            <input
              type="hidden"
              name="permissions"
              value={JSON.stringify(selectedPermissions)}
            />

            {/* Botón */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditMode ? "Guardando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditMode ? "Guardar Rol" : "Crear Rol"}
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
