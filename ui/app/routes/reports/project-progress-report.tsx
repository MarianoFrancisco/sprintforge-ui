// routes/reporting/project-progress-report.tsx
import { useEffect, useMemo, useRef, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { PdfViewer } from "~/components/reports/pdf-viewer";
import { ReportActions } from "~/components/reports/report-actions";
import { usePdfReport } from "~/hooks/use-pdf-report";
import { REPORT_ENDPOINTS } from "~/services/reports/reports-service";
import type { ComboboxOption } from "~/types/filters";
import { Combobox } from "~/components/common/combobox-option";
import { projectService } from "~/services/scrum/project-service";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

export type ProjectOption = {
  id: string;
  name: string;
};

export async function loader(): Promise<ProjectOption[]> {
  try {
    const response = await projectService.getAll();
    return response.map((project) => ({
      id: project.id,
      name: project.name,
    }));
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

export default function ProjectProgressReportRoute() {
  const projects = useLoaderData<typeof loader>();
  const [projectId, setProjectId] = useState<string>("");
  const navigate = useNavigate();
  const hasShownRef = useRef(false);

  const {
    pdfUrl,
    loading,
    error,
    fetchPdf,
    downloadPdf,
    openInNewTab,
    clearPdf,
    setError,
  } = usePdfReport(REPORT_ENDPOINTS.PROJECT_PROGRESS, {
    autoLoad: false,
    filename: "reporte-avance-proyectos.pdf",
  });

  const projectOptions: ComboboxOption[] = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects]
  );

  const handleGenerate = () => {
    setError(null);

    // Param opcional
    if (projectId) {
      fetchPdf({ projectId });
    } else {
      fetchPdf();
    }
  };

  const handleDownload = () => {
    const filename = projectId
      ? `avance-proyecto_${projectId}.pdf`
      : "avance-proyectos_all.pdf";

    downloadPdf(filename);
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

useEffect(() => {
  if (hasShownRef.current) return;

  if (projects.length === 0) {
    hasShownRef.current = true;
    toast.error("No hay proyectos disponibles para generar el reporte.");
    navigate("/");
  }
}, [projects, navigate]);

if (projects.length === 0) {
  return null; // O un mensaje de carga si prefieres
}

  return (
    <section className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-xl md:text-2xl font-bold">Avance de proyectos</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Genera, visualiza y descarga el reporte de avance en PDF.
          {projectId ? " (filtrado por proyecto)" : " (todos los proyectos)"}
        </p>
      </header>

      {/* Filtro + Actions (mismo patrón que hicimos) */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-6 items-end">
        {/* Filtros (Card compacta) */}
        <Card className="w-full md:max-w-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros</CardTitle>
            <CardDescription>Opcional</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-2">
            <Label>Proyecto</Label>
            <Combobox
              options={projectOptions}
              value={projectId}
              onChange={setProjectId}
              placeholder="Seleccionar proyecto"
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex md:justify-end">
          <ReportActions
            loading={loading}
            pdfUrl={pdfUrl}
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            onOpenInNewTab={openInNewTab}
            onClear={clearPdf}
            generateLabel="Generar PDF"
            regenerateLabel="Regenerar PDF"
          />
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="rounded-lg overflow-hidden">
        <PdfViewer
          pdfUrl={pdfUrl}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          height="600px"
          title="Avance de proyectos"
        />
      </div>

      {/* Endpoint preview (opcional, estilo similar) */}
      <div className="text-sm text-muted-foreground">
        <p>
          Endpoint:{" "}
          <code className="bg-muted px-2 py-1 rounded">
            {REPORT_ENDPOINTS.PROJECT_PROGRESS}
            {projectId ? `?projectId=${projectId}` : ""}
          </code>
        </p>
      </div>
    </section>
  );
}
