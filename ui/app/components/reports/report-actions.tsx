// components/reporting/ReportActions.tsx
import {
  Download,
  FileText,
  Loader2,
  RefreshCw,
  ExternalLink,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

interface ReportActionsProps {
  loading: boolean;
  pdfUrl: string | null;
  onGenerate: () => void;
  onDownload?: () => void;
  onOpenInNewTab?: () => void;
  onClear?: () => void;
  generateLabel?: string;
  regenerateLabel?: string;
  showClearButton?: boolean;
  className?: string;
}

export function ReportActions({
  loading,
  pdfUrl,
  onGenerate,
  onDownload,
  onOpenInNewTab,
  onClear,
  generateLabel = "Generar PDF",
  regenerateLabel = "Regenerar PDF",
  showClearButton = true,
  className = "",
}: ReportActionsProps) {
  const hasPdf = Boolean(pdfUrl);
  const disableActions = loading || !hasPdf;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Acción principal */}
      <Button
        onClick={onGenerate}
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
            {hasPdf ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            {hasPdf ? regenerateLabel : generateLabel}
          </>
        )}
      </Button>

      {/* Acciones secundarias */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={!hasPdf && !loading}
            aria-label="Más acciones"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onDownload}
            disabled={disableActions || !onDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onOpenInNewTab}
            disabled={disableActions || !onOpenInNewTab}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir en nueva pestaña
          </DropdownMenuItem>

          {showClearButton && onClear && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onClear}
                variant="destructive"
                disabled={disableActions}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
