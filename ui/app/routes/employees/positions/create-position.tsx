import { redirect, useActionData, type ActionFunctionArgs } from "react-router";
import type { CreatePositionRequest } from "~/types/employees/position";
import { ApiError } from "~/lib/api-client";
import { positionService } from "~/services/employees/position-service";
import { PositionForm } from "~/components/employees/positions/position-form";
import type { Route } from "../../+types/home";
import { toast } from "sonner";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo cargo" },
  ];
}

export const handle = {
  crumb: "Crear cargo",
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const positionData: CreatePositionRequest = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
    };

    await positionService.create(positionData);
    return { success: "Cargo creado correctamente" }
  } catch (error: any) {
    console.log("error en action create position", error);
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

    return { error: error.message || "Error al crear el cargo" };
  }
}

export default function CreatePositionPage() {
    const actionData = useActionData();

    useEffect(() => {
        if (actionData?.error) {
            toast.error(actionData.error);
        }
        if (actionData?.success) {
            toast.success(actionData.success);
        }
    }, [actionData]);
  return (
    <section className="p-6">
      <PositionForm />
    </section>
  );
}
