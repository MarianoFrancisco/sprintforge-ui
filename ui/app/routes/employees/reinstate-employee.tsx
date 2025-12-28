import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
  type MiddlewareFunction,
} from "react-router";
import { ApiError } from "~/lib/api-client";
import { employeeService } from "~/services/employees/employee-service";
import { EmployeeHistoryChangeForm } from "~/components/employees/employee-history-change-form";
import { useEffect } from "react";
import { toast } from "sonner";
import type { EmployeeResponseDTO } from "~/types/employees/employee";
import { EmployeeCard } from "~/components/employees/cards/employee-card";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { PERMS } from "~/config/permissions";

export function meta({}: any) {
  return [{ title: "Reincorporar empleado" }];
}

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.EMPLOYEE_VIEW, PERMS.EMPLOYEE_REINSTATE], {
    flashMessage: "No tienes permiso para reincorporar Empleados."
  }),
];

// Loader: carga el empleado por id
export async function loader({ params }: LoaderFunctionArgs) {
  const { cui } = params;
  if (!cui) throw new Error("CUI del empleado no proporcionado");

  try {
    const employee: EmployeeResponseDTO = await employeeService.getByCui(cui);
    return { employee };
  } catch (error) {
    throw new Error("Error al cargar los datos del empleado");
  }
}

// Action: enviar request de aumento de salario
export async function action({ request, params }: ActionFunctionArgs) {
  const { cui } = params;
  if (!cui) throw new Error("CUI del empleado no proporcionado");

  const formData = await request.formData();

  const date = formData.get("date") as string;
  const notes = (formData.get("notes") as string) || "";

  try {
    await employeeService.reinstate(cui, {
      date,
      notes,
    });
    return { success: "Empleado reincorporado correctamente" };
  } catch (error: any) {
    if (error instanceof ApiError && error.response) {
      const err = error.response as any;
      return {
        errors: err.errors || {},
        error: err.detail || err.message || `Error ${error.status}`,
      };
    }
    return { error: error.message || "Error al reincorporar empleado" };
  }
}

// Página
export default function ReinstateEmployeePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
    if (actionData?.success) {
      toast.success(actionData.success);
      navigate(`/employees`);
    }
  }, [actionData, navigate, data.employee]);

return (
  <section className="p-6">
    <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
      Reincorporar empleado
    </h2>

    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
      {/* Card del empleado */}
      <div className="flex-1 max-w-sm w-full">
        <EmployeeCard employee={data.employee} />
      </div>

      {/* Formulario para aumentar salario */}
      <div className="flex-1 max-w-sm w-full">
        <EmployeeHistoryChangeForm type="REINSTATEMENT" />
      </div>
    </div>
  </section>
);


}
