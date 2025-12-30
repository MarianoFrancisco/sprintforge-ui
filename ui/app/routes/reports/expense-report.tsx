// routes/reporting/termination-history-report.tsx
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { PdfViewer } from "~/components/reports/pdf-viewer";
import { ReportActions } from "~/components/reports/report-actions";
import { usePdfReport } from "~/hooks/use-pdf-report";
import { REPORT_ENDPOINTS } from "~/services/reports/reports-service";
import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";
import type { MiddlewareFunction } from "react-router";

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.REPORT_EXPENSES], {
    flashMessage: "No tienes permiso para ver el reporte de gastos."
  }),
];

export default function ExpenseReportRoute() {
  // opcionales: si están vacíos, NO se mandan y el backend devuelve todo
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const {
    pdfUrl,
    loading,
    error,
    fetchPdf,
    downloadPdf,
    openInNewTab,
    clearPdf,
    setError,
  } = usePdfReport(REPORT_ENDPOINTS.EXPENSES, {
    autoLoad: false,
    filename: "reporte-expense.pdf",
  });

  const handleGenerate = () => {
    setError(null);

    const params: Record<string, string> = {};
    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    fetchPdf(params);
  };

  const handleDownload = () => {
    const range =
      fromDate || toDate
        ? `_${fromDate || "all"}_${toDate || "all"}`
        : "_all";

    downloadPdf(`expenses${range}.pdf`);
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  return (
    <section className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header responsive (manteniendo estilo) */}
      <header className="grid gap-3">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">Reporte de Gastos</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Genera, visualiza y descarga el reporte de gastos en PDF.
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
            Los campos son opcionales. Si no seleccionas fechas, se generará el reporte con todos los registros.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          title="expenses report"
        />
      </div>
    </section>
  );
}
