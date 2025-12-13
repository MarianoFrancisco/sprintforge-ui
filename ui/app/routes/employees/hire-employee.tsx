import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
} from "react-router";
import { ApiError } from "~/lib/api-client";
import type { Route } from "../+types/home";
import { positionService } from "~/services/employees/position-service";
import { employeeService } from "~/services/employees/employee-service";
import { EmployeeForm } from "~/components/employees/employee-form";
import { useEffect } from "react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contratar empleado" },
  ];
}

export async function loader({}: LoaderFunctionArgs) {
  try {
    const positions = await positionService.getAll();

    return { positions };
  } catch (_) {
    return { positions: [] };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // Detectar si existe un file real
  const file = formData.get("profileImage");
  const profileImage =
    file instanceof File && file.size > 0 && file.name
      ? file
      : null;

  const hireEmployeeRequest = {
    cui: formData.get("cui") as string,
    email: formData.get("email") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    birthDate: formData.get("birthDate") as string,
    positionId: formData.get("positionId") as string,
    workloadType: formData.get("workloadType") as string,
    salary: formData.get("salary") as string,
    igssPercentage: formData.get("igssPercentage") as string,
    irtraPercentage: formData.get("irtraPercentage") as string,
    profileImage,
    startDate: formData.get("startDate") as string,
    notes: (formData.get("notes") as string) || "",
  };

  console.log("ACTION RECEIVED: ", hireEmployeeRequest);

  try {
    await employeeService.hire(hireEmployeeRequest);
    return {success: "Empleado contratado exitosamente"};
  } catch (error: any) {
    if (error instanceof ApiError && error.response) {
      const err = error.response as any;
      return {
        errors: err.errors || {},
        error: err.detail || err.message || `Error ${error.status}`,
      };
    }

    return { error: error.message || "Error al contratar empleado" };
  }
}

export default function HireEmployeePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const navigate = useNavigate();

      useEffect(() => {
        if (actionData?.error) {
            toast.error(actionData.error);
        }
        if (actionData?.success) {
            toast.success(actionData.success, {
                action: {
                    label: "Ver cargos",
                    onClick: () => {
                        // navigate("/employees/positions");
                        console.log("Ver empleados");
                    },
                },
            });
            navigate("/employees/hire");
        }
    }, [actionData]);


  return (
    <section className="p-6">
      <EmployeeForm positions={data.positions} />
    </section>
  );
}
