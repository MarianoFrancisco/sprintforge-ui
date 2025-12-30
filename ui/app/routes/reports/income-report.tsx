// routes/reporting/income-report.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { PdfViewer } from "~/components/reports/pdf-viewer";
import { ReportActions } from "~/components/reports/report-actions";
import { usePdfReport } from "~/hooks/use-pdf-report";
import { REPORT_ENDPOINTS } from "~/services/reports/reports-service";

import { Combobox } from "~/components/common/combobox-option";
import type { ComboboxOption } from "~/types/filters";
import { projectService } from "~/services/scrum/project-service";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import type { MiddlewareFunction } from "react-router";

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.REPORT_INCOMES], {
    flashMessage: "No tienes permiso para ver el reporte de ingresos."
  }),
];

export type ProjectOption = {
  id: string;
  name: string;
};

type IncomeSubtotal = "CLIENT" | "AREA";

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

export default function IncomeReportRoute() {
  const projects = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const hasShownRef = useRef(false);

  // Requeridos en backend: from, to, subtotalType (y projectId opcional)
  const [fromDate, setFromDate] = useState<string>(""); // yyyy-mm-dd
  const [toDate, setToDate] = useState<string>(""); // yyyy-mm-dd
  const [subtotalType, setSubtotalType] = useState<IncomeSubtotal>("CLIENT");
  const [projectId, setProjectId] = useState<string>(""); // opcional

  const {
    pdfUrl,
    loading,
    error,
    fetchPdf,
    downloadPdf,
    openInNewTab,
    clearPdf,
    setError,
  } = usePdfReport(REPORT_ENDPOINTS.INCOME, {
    autoLoad: false,
    filename: "reporte-ingresos.pdf",
  });

  const projectOptions: ComboboxOption[] = useMemo(
    () => projects.map((p) => ({ value: p.id, label: p.name })),
    [projects]
  );

  const subtotalOptions: ComboboxOption[] = useMemo(
    () => [
      { value: "CLIENT", label: "Por cliente" },
      { value: "AREA", label: "Por área" },
    ],
    []
  );

  const handleGenerate = () => {
    setError(null);

    // Validación mínima en frontend (backend también valida subtotalType)
    if (!fromDate || !toDate) {
      toast.error("Selecciona la fecha desde y hasta.");
      return;
    }

    const params: Record<string, string> = {
      from: fromDate,
      to: toDate,
      subtotalType,
    };

    if (projectId) params.projectId = projectId;

    fetchPdf(params);
  };

  const handleDownload = () => {
    const pid = projectId || "all";
    downloadPdf(`ingresos_${fromDate}_${toDate}_${subtotalType}_${pid}.pdf`);
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
      {/* Header responsive (manteniendo estilo) */}
      <header className="grid gap-3">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">Reporte de Ingresos</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Genera, visualiza y descarga el reporte de ingresos en PDF.
          </p>
        </div>

        <div className="flex items-center justify-end">
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
      </header>

      {/* Filtros en Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Selecciona el rango de fechas y el tipo de subtotal. El proyecto es opcional.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="grid gap-2">
            <Label htmlFor="fromDate">Fecha desde</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="toDate">Fecha hasta</Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo de subtotal</Label>
            <Combobox
              options={subtotalOptions}
              value={subtotalType}
              onChange={(v) => setSubtotalType((v as IncomeSubtotal) || "CLIENT")}
              placeholder="Seleccionar tipo"
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label>Proyecto (opcional)</Label>
            <Combobox
              options={projectOptions}
              value={projectId}
              onChange={setProjectId}
              placeholder={projects.length ? "Seleccionar proyecto" : "Sin proyectos disponibles"}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      <div className="rounded-lg overflow-hidden">
        <PdfViewer
          pdfUrl={pdfUrl}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          height="600px"
          title="Reporte de ingresos"
        />
      </div>
    </section>
  );
}
