// ~/routes/projects/create-project-payment.tsx
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useLoaderData,
  type MiddlewareFunction,
  redirect,
  data,
} from "react-router";
import { requireIdentity } from "~/auth.server";
import type { ProjectResultResponseDTO } from "~/types/scrum/project";
import { projectService } from "~/services/scrum/project-service";
import type { CreatePaymentRequestDTO, PaymentMethod } from "~/types/scrum/project-payment";
import { projectPaymentService } from "~/services/scrum/project-payment-service";
import { ProjectCard } from "~/components/scrum/project/project-card";
import { ProjectPaymentForm } from "~/components/scrum/project/payment/project-payment-form";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import { PERMS } from "~/config/permissions";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta() {
  return [{ title: "Registrar pago de proyecto" }];
}

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.PROJECT_PAY], {
    flashMessage: "No tienes permiso para registrar un pago de proyecto."
  }),
];

// Loader: carga el proyecto por params.id
export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del proyecto no proporcionado");

  try {
    const project: ProjectResultResponseDTO = await projectService.getById(id);
    return { project };
  } catch (error) {
    throw new Error("Error al cargar los datos del proyecto");
  }
}

// Action: crea el pago (employeeId viene de la session)
export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);
      const {employeeId} = await requireIdentity(request, {
        redirectTo: "/",
        flashMessage: "Debes iniciar sesión para crear un proyecto.",
      })
  const { id } = params;
  if (!id) throw new Error("ID del proyecto no proporcionado");

  const formData = await request.formData();

  try {
    const method = (formData.get("method") as PaymentMethod) || "CASH";

    const payload: CreatePaymentRequestDTO = {
        employeeId: employeeId,
        projectId: id,
      date: (formData.get("date") as string) || "",
      amount: ((formData.get("amount") as string) || "").trim(),
      method,
      reference:
        method === "TRANSFER"
          ? (((formData.get("reference") as string) || "").trim() || undefined)
          : undefined,
      note: (((formData.get("note") as string) || "").trim() || undefined),
    };

    await projectPaymentService.create(payload);
    session.flash("success", "Pago registrado correctamente.");
    return redirect(`/projects/${id}`, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  } catch (error: any) {
    console.log("error en action create project payment", error);
    session.flash("error", error?.response?.detail || "Error al registrar el pago.");
    return data({errors: error?.response?.errors || {}}, {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  }
}

// Página
export default function CreateProjectPaymentPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <section className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
        Registrar pago
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        {/* Card del proyecto */}
        <div className="flex-1 max-w-md w-full">
          <ProjectCard project={data.project} />
        </div>

        {/* Formulario de pago */}
        <div className="flex-1 max-w-md w-full">
          <ProjectPaymentForm />
        </div>
      </div>
    </section>
  );
}
