import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
} from "react-router";
import { ApiError } from "~/lib/api-client";
import { employeeService } from "~/services/employees/employee-service";
import { EmployeeHistoryChangeForm } from "~/components/employees/employee-history-change-form";
import { useEffect } from "react";
import { toast } from "sonner";
import type { EmployeeResponseDTO } from "~/types/employees/employee";
import { EmployeeCard } from "~/components/employees/cards/employee-card";

export function meta({}: any) {
  return [{ title: "Aumentar salario" }];
}

// Loader: carga el empleado por id
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del empleado no proporcionado");

  try {
    const employee: EmployeeResponseDTO = await employeeService.getByCui(id);
    return { employee };
  } catch (error) {
    throw new Error("Error al cargar los datos del empleado");
  }
}

// Action: enviar request de aumento de salario
export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del empleado no proporcionado");

  const formData = await request.formData();
  const increaseAmount = Number(formData.get("increaseAmount"));

  if (isNaN(increaseAmount) || increaseAmount <= 0) {
    return { error: "El monto de aumento debe ser mayor que 0" };
  }

  const date = formData.get("date") as string;
  const notes = (formData.get("notes") as string) || "";

  try {
    await employeeService.increaseSalary(id, {
      increaseAmount,
      date,
      notes,
    });
    return { success: "Salario aumentado correctamente" };
  } catch (error: any) {
    if (error instanceof ApiError && error.response) {
      const err = error.response as any;
      return {
        errors: err.errors || {},
        error: err.detail || err.message || `Error ${error.status}`,
      };
    }
    return { error: error.message || "Error al aumentar salario" };
  }
}

// Página
export default function IncreaseSalaryPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
    if (actionData?.success) {
      toast.success(actionData.success);
    }
  }, [actionData, navigate, data.employee]);

return (
  <section className="p-6">
    <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
      Aumento salarial
    </h2>

    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
      {/* Card del empleado */}
      <div className="flex-1 max-w-sm w-full">
        <EmployeeCard employee={data.employee} />
      </div>

      {/* Formulario para aumentar salario */}
      <div className="flex-1 max-w-sm w-full">
        <EmployeeHistoryChangeForm type="SALARY_INCREASE" />
      </div>
    </div>
  </section>
);


}
