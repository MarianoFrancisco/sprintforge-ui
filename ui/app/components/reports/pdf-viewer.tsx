// components/reporting/PdfViewer.tsx
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card } from '../ui/card';

interface PdfViewerProps {
  pdfUrl: string | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
  height?: string | number;
  title?: string;
  showPlaceholder?: boolean;
  className?: string;
}

export function PdfViewer({
  pdfUrl,
  loading,
  error,
  onRetry,
  height = '600px',
  title = 'Documento PDF',
  showPlaceholder = true,
  className = '',
}: PdfViewerProps) {
  if (loading) {
    return (
      <Card className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando documento...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`flex flex-col items-center justify-center p-8 ${className}`} style={{ height }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-destructive mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error al cargar el documento</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Reintentar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (pdfUrl) {
    return (
      <iframe
        src={pdfUrl}
        title={title}
        className={`w-full border-0 ${className}`}
        style={{ height }}
        onError={() => {
          console.error('Error al cargar el PDF en el visor');
        }}
      />
    );
  }

  if (showPlaceholder) {
    return (
      <Card className={`flex flex-col items-center justify-center p-8 text-center ${className}`} style={{ height }}>
        <FileText className="h-24 w-24 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay documento cargado</h3>
        <p className="text-muted-foreground mb-6">
          Haz clic en "Generar PDF" para visualizar el documento
        </p>
      </Card>
    );
  }

  return null;
}