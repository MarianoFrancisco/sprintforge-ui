// routes/scrum/project/by-id/project-report-progress.tsx
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

type LoaderData = {
  projectId: string;
};

// Configuración - CAMBIA ESTOS VALORES
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const projectId = params.projectId;
  if (!projectId) throw new Response("projectId no proporcionado en la ruta", { status: 400 });
  return { projectId };
}

export default function ProjectReportProgressRoute() {
  const { projectId } = useLoaderData() as LoaderData;

  const handleOpenPdf = () => {
    const url = new URL("/api/v1/reporting/project-progress.pdf", API_BASE_URL);
    url.searchParams.set("projectId", projectId);

    // abre en nueva pestaña
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={handleOpenPdf}
        className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        Abrir reporte (PDF)
      </button>
    </div>
  );
}
