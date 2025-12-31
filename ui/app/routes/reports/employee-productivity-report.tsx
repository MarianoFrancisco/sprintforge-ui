// routes/reporting/employee-productivity-report.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { MiddlewareFunction } from "react-router";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { PdfViewer } from "~/components/reports/pdf-viewer";
import { ReportActions } from "~/components/reports/report-actions";
import { usePdfReport } from "~/hooks/use-pdf-report";
import { REPORT_ENDPOINTS } from "~/services/reports/reports-service";
import type { ComboboxOption } from "~/types/filters";
import { Combobox } from "~/components/common/combobox-option";
import { Input } from "~/components/ui/input";

import { PERMS } from "~/config/permissions";
import { permissionMiddleware } from "~/middlewares/permission-middleware";

import { employeeService } from "~/services/employees/employee-service";

export const middleware: MiddlewareFunction[] = [
  permissionMiddleware([PERMS.REPORT_EMPLOYEE_PRODUCTIVITY], {
    flashMessage: "No tienes permiso para ver el reporte de productividad de empleados.",
  }),
];

export type EmployeeOption = {
  id: string;
  name: string;
};

export async function loader(): Promise<EmployeeOption[]> {
  try {
    const response = await employeeService.getAll();

    // Ajusta aquí si tu DTO es distinto
    return response.map((e: any) => ({
      id: e.id,
      name: e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim(),
    }));
  } catch (error) {
    console.error("Error loading employees:", error);
    return [];
  }
}

export default function EmployeeProductivityReportRoute() {
  const employees = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const hasShownRef = useRef(false);

  // filtros (todos opcionales)
  const [employeeId, setEmployeeId] = useState<string>("");
  const [from, setFrom] = useState<string>(""); // YYYY-MM-DD
  const [to, setTo] = useState<string>("");   // YYYY-MM-DD

  const {
    pdfUrl,
    loading,
    error,
    fetchPdf,
    downloadPdf,
    openInNewTab,
    clearPdf,
    setError,
  } = usePdfReport(REPORT_ENDPOINTS.EMPLOYEE_PRODUCTIVITY, {
    autoLoad: false,
    filename: "reporte-productividad-empleados.pdf",
  });

  const employeeOptions: ComboboxOption[] = useMemo(
    () => employees.map((e) => ({ value: e.id, label: e.name })),
    [employees]
  );

  const handleGenerate = () => {
    setError(null);

    // construir params SOLO con lo que exista
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (employeeId) params.employeeId = employeeId;

    // si no hay nada, se llama sin params
    if (Object.keys(params).length > 0) fetchPdf(params);
    else fetchPdf();
  };

  const handleDownload = () => {
    const parts: string[] = [];

    if (employeeId) parts.push(`employee_${employeeId}`);
    if (from) parts.push(`from_${from}`);
    if (to) parts.push(`to_${to}`);

    const filename =
      parts.length > 0
        ? `productividad_${parts.join("_")}.pdf`
        : "productividad-empleados_all.pdf";

    downloadPdf(filename);
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  useEffect(() => {
    if (hasShownRef.current) return;

    if (employees.length === 0) {
      hasShownRef.current = true;
      toast.error("No hay empleados disponibles para generar el reporte.");
      navigate("/");
    }
  }, [employees, navigate]);

  if (employees.length === 0) return null;

  return (
    <section className="p-4 md:p-6 space-y-4 md:space-y-6">
      <header className="grid gap-3">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">Reporte de Productividad de Empleados</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Genera, visualiza y descarga el reporte de productividad en PDF.
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

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Todos los filtros son opcionales. Si no seleccionas ninguno, se generará el reporte para todos los empleados y todo el rango disponible.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Empleado</Label>
            <Combobox
              options={employeeOptions}
              value={employeeId}
              onChange={setEmployeeId}
              placeholder="Seleccionar empleado"
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label>Desde</Label>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Hasta</Label>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg overflow-hidden">
        <PdfViewer
          pdfUrl={pdfUrl}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          height="600px"
          title="Employee productivity report"
        />
      </div>
 {/* Endpoint preview (opcional, estilo similar al ejemplo) */}
      <div className="text-sm text-muted-foreground">
        <p>
          Endpoint:{" "}
          <code className="bg-muted px-2 py-1 rounded">
            {REPORT_ENDPOINTS.INCOME}?from={from || "YYYY-MM-DD"}&to={to || "YYYY-MM-DD"}
            {employeeId ? `&employeeId=${employeeId}` : ""}
          </code>
        </p>
      </div>
    </section>
  );
}
