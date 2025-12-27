// pay-employee.tsx
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
} from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { ApiError } from "~/lib/api-client";

import { employeeService } from "~/services/employees/employee-service";
import { employeePaymentService } from "~/services/employees/employee-payment-service";

import type { EmployeeResponseDTO } from "~/types/employees/employee";
import type { PayEmployeeRequestDTO } from "~/types/employees/employee-payment";

import { EmployeeCard } from "~/components/employees/cards/employee-card";
import { EmployeePaymentForm } from "~/components/employees/payments/employee-payment-form";

export function meta() {
  return [{ title: "Realizar pago" }];
}

// Loader: carga el empleado por CUI (params.id)
export async function loader({ params }: LoaderFunctionArgs) {
  const { cui } = params;
  if (!cui) throw new Error("cui del empleado no proporcionado");

  try {
    const employee: EmployeeResponseDTO = await employeeService.getByCui(cui);
    return { employee };
  } catch (error) {
    throw new Error("Error al cargar los datos del empleado");
  }
}

// Action: envía la petición de pago usando el CUI del param (sin validaciones frontend)
export async function action({ request, params }: ActionFunctionArgs) {
  const { cui } = params;
  if (!cui) throw new Error("cui del empleado no proporcionado");

  const formData = await request.formData();

  try {
    const payload: PayEmployeeRequestDTO = {
      date: (formData.get("date") as string) || "",
      bonus:
        formData.get("bonus") !== null && String(formData.get("bonus")).trim() !== ""
          ? Number(formData.get("bonus"))
          : 0,
      deduction:
        formData.get("deduction") !== null && String(formData.get("deduction")).trim() !== ""
          ? Number(formData.get("deduction"))
          : 0,
      notes: ((formData.get("notes") as string) || "").trim() || undefined,
    };

    await employeePaymentService.payEmployee(cui, payload);
    return { success: "Pago realizado correctamente" };
  } catch (error: any) {
    console.log("error en action pay employee", error);

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

    return { error: error.message || "Error al realizar el pago" };
  }
}

// Página
export default function PayEmployeePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);
    if (actionData?.success) toast.success(actionData.success, {
        action: {
          label: "Ver pagos",
          onClick: () => {
            navigate(`/employees/payments?searchTerm=${data.employee.cui}`);
          },
        },
    });
  }, [actionData, navigate, data.employee]);

  return (
    <section className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
        Realizar pago
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        {/* Card del empleado */}
        <div className="flex-1 max-w-sm w-full">
          <EmployeeCard employee={data.employee} />
        </div>

        {/* Formulario de pago */}
        <div className="flex-1 max-w-sm w-full">
          <EmployeePaymentForm />
        </div>
      </div>
    </section>
  );
}
