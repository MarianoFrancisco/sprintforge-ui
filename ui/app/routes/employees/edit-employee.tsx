import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  useActionData,
  useNavigate,
  useParams,
} from "react-router";
import { ApiError } from "~/lib/api-client";
import { positionService } from "~/services/employees/position-service";
import { employeeService } from "~/services/employees/employee-service";
import { EmployeeForm } from "~/components/employees/employee-form";
import { useEffect } from "react";
import { toast } from "sonner";
import type { EmployeeWorkloadType } from "~/types/employees/employee";
import { EmployeeUpdateForm } from "~/components/employees/employee-update-form";

export function meta({}: any) {
  return [{ title: "Editar empleado" }];
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del empleado no proporcionado");

  try {
    const employee = await employeeService.getById(id);

    return { employee };
  } catch (error) {
    throw new Error("Error al cargar los datos del empleado");
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del empleado no proporcionado");

  const formData = await request.formData();

  const file = formData.get("profileImage");
  const profileImage =
    file instanceof File && file.size > 0 && file.name
      ? file
      : null;

  const updateEmployeeRequest = {
    cui: formData.get("cui") as string,
    email: formData.get("email") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    birthDate: formData.get("birthDate") as string,
    positionId: formData.get("positionId") as string,
    workloadType: formData.get("workloadType") as EmployeeWorkloadType,
    salary: Number(formData.get("salary")),
    profileImage,
    startDate: formData.get("startDate") as string,
    notes: (formData.get("notes") as string) || "",
  };

  try {
    await employeeService.update(id, updateEmployeeRequest);
    return { success: "Empleado actualizado exitosamente" };
  } catch (error: any) {
    if (error instanceof ApiError && error.response) {
      const err = error.response as any;
      return {
        errors: err.errors || {},
        error: err.detail || err.message || `Error ${error.status}`,
      };
    }
    return { error: error.message || "Error al actualizar empleado" };
  }
}

export default function EditEmployeePage() {
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
          label: "Ver empleados",
          onClick: () => navigate("/employees"),
        },
      });
    }
  }, [actionData, navigate]);

  return (
    <section className="p-6">
      <EmployeeUpdateForm employee={data.employee} />
    </section>
  );
}
