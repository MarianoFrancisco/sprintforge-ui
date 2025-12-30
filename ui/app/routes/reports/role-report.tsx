// routes/reporting/role-general-report.tsx
import { useMemo } from "react";
import { Button } from "~/components/ui/button";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8006";

function joinUrl(base: string, path: string) {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

function reportingEndpoint(base: string) {
  const clean = base.replace(/\/+$/, "");
  return clean.endsWith("/api/v1")
    ? joinUrl(clean, "reporting")
    : joinUrl(clean, "api/v1/reporting");
}

export default function RoleGeneralReportRoute() {
  const baseReportUrl = useMemo(() => reportingEndpoint(API_BASE_URL), []);

  const handleOpen = () => {
    const url = joinUrl(baseReportUrl, "role-general.pdf");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">Reporte general de roles</h1>
      <Button onClick={handleOpen}>Abrir / Descargar PDF</Button>
    </section>
  );
}
