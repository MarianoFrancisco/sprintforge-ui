// routes/scrum/project/project-activity-history.tsx
import { data, type LoaderFunctionArgs, useLoaderData } from "react-router";

import type { ScrumActivityResponseDTO } from "~/types/scrum/scrum-activiy";
import { scrumActivityService } from "~/services/scrum/scrum-activity-service";
import { ScrumActivityHistoryDialog } from "~/components/scrum/activity/scrum-activity-dialog";

// (Opcional) si ya tienes un middleware de proyecto/permiso, lo puedes agregar aquí
// import { projectMiddleware } from "~/middlewares/project-middleware";

export const handle = {
  crumb: "Historial de proyecto",
};

// export const middleware: MiddlewareFunction[] = [
//   projectMiddleware({ flashMessage: "Proyecto no encontrado o sin acceso." }),
// ];

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) throw new Error("ID del proyecto no proporcionado");

  const activities = await scrumActivityService.getByProject(id);
  return data({ projectId: id, activities });
}

export default function ProjectActivityHistoryRoute() {
  const { activities } = useLoaderData<typeof loader>() as {
    projectId: string;
    activities: ScrumActivityResponseDTO[];
  };

  return <ScrumActivityHistoryDialog activities={activities} />;
}
