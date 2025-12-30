// BORRAR LUEGO ESTA VISTA
// routes/reporting/role-general-report.tsx
import { useState, useRef, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
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

export default function RoleGeneralReportRoute() {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const baseReportUrl = useMemo(() => reportingEndpoint(API_BASE_URL), []);
  const reportUrl = useMemo(() => joinUrl(baseReportUrl, "role-general.pdf"), [baseReportUrl]);

  const fetchPdf = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener el token de autenticación (ajusta según tu implementación)
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(reportUrl, {
        method: 'GET',
        headers: {
          // 'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf',
          // Agrega otros headers necesarios según tu API
          'Content-Type': 'application/json',
        },
        // credentials: 'include', // Si usas cookies/sesión
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Crear URL para el blob
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      
      toast.success("PDF cargado");
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast.error(`No se pudo cargar el PDF: ${errorMessage}`);
      console.error('Error fetching PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'reporte-general-roles.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  // Limpiar el objeto URL cuando el componente se desmonte
  const clearPdfUrl = () => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  // Opcional: Si quieres cargar automáticamente al montar el componente
  // useEffect(() => {
  //   fetchPdf();
  //   return () => {
  //     if (pdfUrl) {
  //       window.URL.revokeObjectURL(pdfUrl);
  //     }
  //   };
  // }, []);

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reporte general de roles</h1>
          <p className="text-muted-foreground">
            Visualiza y descarga el reporte en formato PDF
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={fetchPdf}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                {pdfUrl ? 'Recargar PDF' : 'Cargar PDF'}
              </>
            )}
          </Button>
          
          {pdfUrl && (
            <>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button>
              
              <Button
                onClick={handleOpenInNewTab}
                variant="ghost"
              >
                Abrir en nueva pestaña
              </Button>
            </>
          )}
          
          {pdfUrl && (
            <Button
              onClick={clearPdfUrl}
              variant="ghost"
              size="sm"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-700 font-medium">Error:</p>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Verifica la configuración de CORS en el servidor y que tengas los permisos necesarios.
          </p>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-gray-50">
        {loading ? (
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Cargando reporte...</p>
            </div>
          </div>
        ) : pdfUrl ? (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            title="Reporte general de roles"
            className="w-full h-[600px] border-0"
            onLoad={() => console.log('PDF cargado en iframe')}
            onError={() => {
              setError('Error al cargar el PDF en el visor');
              toast.error("No se pudo mostrar el PDF en el visor");
            }}
          />
        ) : (
          <div className="h-[600px] flex flex-col items-center justify-center p-8 text-center">
            <FileText className="h-24 w-24 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay PDF cargado</h3>
            <p className="text-muted-foreground mb-6">
              Haz clic en "Cargar PDF" para generar y visualizar el reporte
            </p>
            <Button onClick={fetchPdf} className="gap-2">
              <FileText className="h-4 w-4" />
              Cargar PDF
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>URL del reporte: <code className="bg-gray-100 px-2 py-1 rounded">{reportUrl}</code></p>
        {pdfUrl && (
          <p className="mt-2">
            PDF cargado en memoria. Se liberará automáticamente al recargar la página o hacer clic en "Limpiar".
          </p>
        )}
      </div>
    </section>
  );
}