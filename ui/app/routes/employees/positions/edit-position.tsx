import {
  data,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type {
  PositionResponseDTO,
  UpdatePositionDetailRequest,
} from "~/types/employees/position";
import { positionService } from "~/services/employees/position-service";
import { PositionForm } from "~/components/employees/positions/position-form";
import type { Route } from "../../+types/home";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "Editar cargo" }];
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) throw new Error("No se proporcionó el ID del cargo");

  try {
    const position = await positionService.getById(params.id);
    return data(position);
  } catch (error) {
    console.error("Loader error:", error);
    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request);
  if (!params.id) throw new Error("No se proporcionó el ID del cargo");
  const formData = await request.formData();
  let errors = {};

  try {
    const updateData: UpdatePositionDetailRequest = {
      name: (formData.get("name") as string).trim(),
      description: (formData.get("description") as string).trim() || "",
    };

    await positionService.update(params.id, updateData);

    return { success: "Puesto actualizado correctamente" };
  } catch (error: any) {
    session.flash("error", error?.response?.detail || "Error al actualizar el puesto.");
    errors = error?.response?.errors || {};
  }
  return data({ errors }, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

export default function EditPositionPage() {
  const position = useLoaderData<typeof loader>() as PositionResponseDTO;
  return (
    <section className="p-6">
      <PositionForm position={position} />
    </section>
  );
}
