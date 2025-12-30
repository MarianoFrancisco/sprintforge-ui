// routes/reporting/income-report.tsx
import { useState } from 'react';
import { PdfViewer } from '~/components/reports/pdf-viewer';
import { ReportActions } from '~/components/reports/report-actions';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { usePdfReport } from '~/hooks/use-pdf-report';
import { REPORT_ENDPOINTS } from '~/services/reports/reports-service';

export default function IncomeReportRoute() {
  const [fromDate, setFromDate] = useState('2025-01-01');
  const [toDate, setToDate] = useState('2025-12-31');
  const [subtotalType, setSubtotalType] = useState('CLIENT');

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
    filename: 'reporte-ingresos.pdf',
  });

  const handleGenerate = () => {
    fetchPdf({
      from: fromDate,
      to: toDate,
      subtotalType,
    });
  };

  const handleDownload = () => {
    const filename = `ingresos_${fromDate}_${toDate}_${subtotalType}.pdf`;
    downloadPdf(filename);
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reporte de ingresos</h1>
          <p className="text-muted-foreground">
            Genera reportes de ingresos por período
          </p>
        </div>

        <ReportActions
          loading={loading}
          pdfUrl={pdfUrl}
          onGenerate={handleGenerate}
          onDownload={handleDownload}
          onOpenInNewTab={openInNewTab}
          onClear={clearPdf}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
        <div>
          <Label htmlFor="fromDate">Fecha desde</Label>
          <Input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="toDate">Fecha hasta</Label>
          <Input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="subtotalType">Tipo de subtotal</Label>
          <Select value={subtotalType} onValueChange={setSubtotalType}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLIENT">Por cliente</SelectItem>
              <SelectItem value="PROJECT">Por proyecto</SelectItem>
              <SelectItem value="CATEGORY">Por categoría</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <PdfViewer
          pdfUrl={pdfUrl}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          height="600px"
          title="Reporte de ingresos"
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Endpoint: <code className="bg-gray-100 px-2 py-1 rounded">
            {REPORT_ENDPOINTS.INCOME}?from={fromDate}&to={toDate}&subtotalType={subtotalType}
          </code>
        </p>
      </div>
    </section>
  );
}