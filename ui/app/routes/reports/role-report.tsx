// routes/reporting/role-general-report.tsx
import { PdfViewer } from "~/components/reports/pdf-viewer";
import { ReportActions } from "~/components/reports/report-actions";
import { usePdfReport } from "~/hooks/use-pdf-report";
import { REPORT_ENDPOINTS } from "~/services/reports/reports-service";

export default function RoleGeneralReportRoute() {
  const {
    pdfUrl,
    loading,
    error,
    fetchPdf,
    downloadPdf,
    openInNewTab,
    clearPdf,
    setError,
  } = usePdfReport(REPORT_ENDPOINTS.ROLE_GENERAL, {
    autoLoad: false,
    filename: "reporte-general-roles.pdf",
  });

  const handleRetry = () => {
    setError(null);
    fetchPdf();
  };

  return (
    <section className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header responsive */}
      <header className="grid gap-3">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">
            Reporte general de roles
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Visualiza y descarga el reporte en formato PDF
          </p>
        </div>

        {/* Actions abajo a la izquierda */}
        <div className="flex items-center justify-end">
          <ReportActions
            loading={loading}
            pdfUrl={pdfUrl}
            onGenerate={fetchPdf}
            onDownload={() => downloadPdf()}
            onOpenInNewTab={openInNewTab}
            onClear={clearPdf}
            generateLabel="Generar PDF"
            regenerateLabel="Regenerar PDF"
          />
        </div>
      </header>

      {/* PDF Viewer */}
      <div className="rounded-lg overflow-hidden">
        <PdfViewer
          pdfUrl={pdfUrl}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          height="600px"
          title="Reporte general de roles"
        />
      </div>
    </section>
  );
}
