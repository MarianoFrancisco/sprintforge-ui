// routes/reporting/hiring-history-report.tsx
import { useMemo, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

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

export default function HiringHistoryReportRoute() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  const baseReportUrl = useMemo(() => reportingEndpoint(API_BASE_URL), []);

  const handleOpenPdf = () => {
    // Validación mínima opcional (si prefieres permitir vacío, quita esto)
    if (!from && !to) {
      toast.error("Selecciona al menos una fecha (Desde o Hasta)");
      return;
    }

    // Si tu backend requiere ambas fechas, usa esta validación en lugar de la anterior:
    // if (!from || !to) { toast.error("Debes seleccionar ambas fechas"); return; }

    setLoading(true);
    try {
      const url = new URL(joinUrl(baseReportUrl, "hiring-history.pdf"));

      // Si no hay fecha, NO se envía
      if (from) url.searchParams.set("from", from);
      if (to) url.searchParams.set("to", to);

      // Navegación directa -> evita CORS de fetch
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } finally {
      // no sabemos cuándo termina de descargar, así que lo bajamos rápido
      setTimeout(() => setLoading(false), 300);
    }
  };

  return (
    <section className="p-6 max-w-md space-y-6">
      <h1 className="text-lg font-semibold">
        Reporte de historial de contrataciones
      </h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">Desde</label>
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Hasta</label>
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <Button onClick={handleOpenPdf} disabled={loading} className="w-full">
        {loading ? "Abriendo..." : "Abrir / Descargar PDF"}
      </Button>

      <p className="text-xs text-muted-foreground break-all">
        Endpoint: {joinUrl(baseReportUrl, "hiring-history.pdf")}
      </p>
    </section>
  );
}
