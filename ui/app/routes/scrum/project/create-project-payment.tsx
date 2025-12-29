// ~/routes/projects/create-project-payment.tsx
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
import { requireIdentity } from "~/auth.server";
import type { ProjectResultResponseDTO } from "~/types/scrum/project";
import { projectService } from "~/services/scrum/project-service";
import type { CreatePaymentRequestDTO, PaymentMethod } from "~/types/scrum/project-payment";
import { projectPaymentService } from "~/services/scrum/project-payment-service";
import { ProjectCard } from "~/components/scrum/project/project-card";
import { ProjectPaymentForm } from "~/components/scrum/project/payment/project-payment-form";

export function meta() {
  return [{ title: "Registrar pago de proyecto" }];
}

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

    // Ajusta la firma a tu servicio real
    await projectPaymentService.create(payload);

    return { success: "Pago registrado correctamente" };
  } catch (error: any) {
    console.log("error en action create project payment", error);

    if (error instanceof ApiError && error.response) {
      try {
        const errorData = (error.response as any).data || error.response;

        return {
          errors: errorData.errors || {},
          error: errorData.detail || errorData.message || `Error ${error.status}`,
        };
      } catch {
        return { error: `Error ${error.status}: No se pudo procesar la respuesta` };
      }
    }

    return { error: error.message || "Error al registrar el pago" };
  }
}

// Página
export default function CreateProjectPaymentPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData() as
    | { error?: string; success?: string; errors?: Record<string, string> }
    | undefined;

  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.error);

    if (actionData?.success) {
      toast.success(actionData.success, {
        action: {
          label: "Ver pagos",
          onClick: () => {
            // Ajusta esta ruta a tu app real
            navigate(`/projects/${data.project.id}/payments`);
          },
        },
      });
    }
  }, [actionData, navigate, data.project.id]);

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
