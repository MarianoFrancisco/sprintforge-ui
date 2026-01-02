import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  type MiddlewareFunction,
  redirect,
  data,
} from "react-router";
import { employeeService } from "~/services/employees/employee-service";
import { EmployeeHistoryChangeForm } from "~/components/employees/employee-history-change-form";
import type { EmployeeResponseDTO } from "~/types/employees/employee";
import { EmployeeCard } from "~/components/employees/cards/employee-card";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { PERMS } from "~/config/permissions";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta({ }: any) {
  return [{ title: "Suspender empleado" }];
}

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.EMPLOYEE_VIEW, PERMS.EMPLOYEE_SUSPEND], {
    flashMessage: "No tienes permiso para suspender Empleados."
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
  const session = await getAuthSession(request);
  const { cui } = params;
  if (!cui) throw new Error("CUI del empleado no proporcionado");

  const formData = await request.formData();

  const date = formData.get("date") as string;
  const notes = (formData.get("notes") as string) || "";

  try {
    await employeeService.suspend(cui, {
      date,
      notes,
    });
    session.flash("success", "Empleado suspendido correctamente.");
    return redirect(`/employees`, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  } catch (error: any) {
    console.log("error en action suspend employee", error);
    session.flash(
      "error",
      error?.response?.detail || "Error al suspender empleado."
    );
    return data({ errors: error?.response?.errors || {} }, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  }
}

// Página
export default function SuspendEmployeePage() {
  const data = useLoaderData<typeof loader>();

  return (
    <section className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
        Suspender empleado
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        {/* Card del empleado */}
        <div className="flex-1 max-w-sm w-full">
          <EmployeeCard employee={data.employee} />
        </div>

        {/* Formulario para aumentar salario */}
        <div className="flex-1 max-w-sm w-full">
          <EmployeeHistoryChangeForm type="SUSPENSION" />
        </div>
      </div>
    </section>
  );
}
