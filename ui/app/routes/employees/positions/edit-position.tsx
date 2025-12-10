import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type {
  PositionResponseDTO,
  UpdatePositionDetailRequest,
} from "~/types/employees/position";
import { positionService } from "~/services/employees/position-service";
import { ApiError } from "~/lib/api-client";
import { PositionForm } from "~/components/employees/positions/position-form";
import type { Route } from "../../+types/home";
import { toast } from "sonner";
import { useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "Editar cargo" }];
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) throw new Error("No se proporcionó el ID del cargo");

  try {
    const position = await positionService.getById(params.id);
    return position;
  } catch (error) {
    console.error("Loader error:", error);
    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.id) throw new Error("No se proporcionó el ID del cargo");

  const formData = await request.formData();

  try {
    const updateData: UpdatePositionDetailRequest = {
      name: (formData.get("name") as string).trim(),
      description: (formData.get("description") as string).trim() || "",
    };

    await positionService.update(params.id, updateData);

    return { success: "Cargo actualizado correctamente" };
  } catch (error: any) {
    console.error("Action error (update position):", error);

    if (error instanceof ApiError && error.response) {
      try {
        const errorData = (error.response as any).data || error.response;

        return {
          errors: errorData.errors || {},
          error:
            errorData.detail ||
            errorData.message ||
            `Error ${error.status}`,
        };
      } catch (parseError) {
        return {
          error: `Error ${error.status}: No se pudo procesar la respuesta`,
        };
      }
    }

    return {
      error: error.message || "Error al actualizar el cargo",
    };
  }
}

export default function EditPositionPage() {
  const position = useLoaderData<typeof loader>() as PositionResponseDTO;
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
            navigate("/employees/positions");
          },
        },
      });
    }
  }, [actionData]);

  return (
    <section className="p-6">
      <PositionForm position={position} />
    </section>
  );
}
