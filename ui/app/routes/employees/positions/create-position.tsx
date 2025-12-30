import { data, redirect, type ActionFunctionArgs } from "react-router";
import type { CreatePositionRequest } from "~/types/employees/position";
import { positionService } from "~/services/employees/position-service";
import { PositionForm } from "~/components/employees/positions/position-form";
import type { Route } from "../../+types/home";
import { commitAuthSession, getAuthSession } from "~/sessions.server";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Nuevo puesto" },
    ];
}

export async function action({ request }: ActionFunctionArgs) {
    const session = await getAuthSession(request);
    const formData = await request.formData();
    let errors = {};
    try {
        const positionData: CreatePositionRequest = {
            name: (formData.get("name") as string).trim(),
            description: (formData.get("description") as string).trim() || "",
        };

        await positionService.create(positionData);
        session.flash("success", "Puesto creado correctamente.");
    } catch (error: any) {
        session.flash("error", error?.response?.detail || "Error al crear el puesto.");
        errors = error?.response?.errors || {};
    }
    return data({errors}, {
        headers: {
            "Set-Cookie": await commitAuthSession(session),
        },
    });
}

export default function CreatePositionPage() {
    return (
        <section className="p-6">
            <PositionForm />
        </section>
    );
}
