// routes/scrum/project/project-activity-history.tsx
import { data, type LoaderFunctionArgs, useLoaderData } from "react-router";

import type { ScrumActivityResponseDTO } from "~/types/scrum/scrum-activiy";
import { scrumActivityService } from "~/services/scrum/scrum-activity-service";
import { ScrumActivityHistoryDialog } from "~/components/scrum/activity/scrum-activity-dialog";

// (Opcional) si ya tienes un middleware de proyecto/permiso, lo puedes agregar aquí
// import { projectMiddleware } from "~/middlewares/project-middleware";

export const handle = {
  crumb: "Historial de sprint",
};

// export const middleware: MiddlewareFunction[] = [
//   projectMiddleware({ flashMessage: "Proyecto no encontrado o sin acceso." }),
// ];

export async function loader({ params }: LoaderFunctionArgs) {
  const { sprintId } = params;
  if (!sprintId) throw new Error("ID del sprint no proporcionado");

  const activities = await scrumActivityService.getBySprint(sprintId);
  return data({ sprintId, activities });
}

export default function ProjectActivityHistoryRoute() {
  const { activities } = useLoaderData<typeof loader>() as {
    sprintId: string;
    activities: ScrumActivityResponseDTO[];
  };

  return <ScrumActivityHistoryDialog activities={activities} />;
}
