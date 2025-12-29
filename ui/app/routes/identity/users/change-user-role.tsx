// routes/identity/users/change-user-role.tsx
import { useEffect } from "react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router";
import { toast } from "sonner";
import { ApiError } from "~/lib/api-client";


import { roleService } from "~/services/identity/role-service";
import { userService } from "~/services/identity/user-service";
import { employeeService } from "~/services/employees/employee-service";

import type { RoleResponseDTO } from "~/types/identity/role";
import type { EmployeeResponseDTO } from "~/types/employees/employee";
import type { UserResponseDTO } from "~/types/identity/user";
import { ChangeUserRoleForm } from "~/components/identity/users/change-user-role-form";

export function meta() {
  return [{ title: "Cambiar rol de usuario" }];
}

type LoaderData = {
  employee: EmployeeResponseDTO;
  currentRole: RoleResponseDTO;
  roles: RoleResponseDTO[];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del usuario no proporcionado");

  try {
    // 1) Usuario (para role actual + employeeId + status si lo necesitas)
    const user = (await userService.getById(id)) as UserResponseDTO;

    // 2) Empleado (para mostrar nombre + CUI)
    const employee = (await employeeService.getById(
      user.employeeId
    )) as EmployeeResponseDTO;

    // 3) Roles activos
    const roles = (await roleService.getAll({
      isActive: true,
    })) as RoleResponseDTO[];

    return {
      employee,
      currentRole: user.role,
      roles,
    } satisfies LoaderData;
  } catch (error) {
    console.error("Error al cargar datos para cambiar rol de usuario", error);
    return { employee: undefined, currentRole: undefined, roles: [] } as any;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del usuario no proporcionado");

  const formData = await request.formData();

  try {
    const roleId = String(formData.get("roleId") ?? "").trim();

    if (!roleId) {
      return {
        errors: { roleId: "Debes seleccionar un rol" },
        error: "Formulario inválido",
      };
    }

    // Validación de negocio: solo ACTIVE
    const user = (await userService.getById(id)) as UserResponseDTO;
    if (user.status !== "ACTIVE") {
      return { error: "Solo puedes cambiar el rol si el usuario está activo" };
    }

    // Cambiar rol (ajusta el método si en tu service se llama distinto)
    await userService.changeRole(id, { roleId });

    return { success: "Rol del usuario actualizado exitosamente" };
  } catch (error: any) {
    console.log("error en action change user role", error);

    if (error instanceof ApiError && error.response) {
      try {
        const errorData = (error.response as any).data || error.response;

        return {
          errors: errorData.errors || {},
          error: errorData.detail || errorData.message || `Error ${error.status}`,
        };
      } catch (parseError) {
        return { error: `Error ${error.status}: No se pudo procesar la respuesta` };
      }
    }

    return { error: error.message || "Error al cambiar el rol del usuario" };
  }
}

export default function ChangeUserRolePage() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
    if (actionData?.success) {
      toast.success(actionData.success, {
        action: {
          label: "Ver usuarios",
          onClick: () => navigate("/identity/users"),
        },
      });
    }
  }, [actionData, navigate]);

  return (
    <section className="p-6">
      <ChangeUserRoleForm
        employee={data.employee}
        currentRole={data.currentRole}
        roles={data.roles}
      />
    </section>
  );
}
