// hooks/usePdfReport.ts
import { useState, useCallback, useEffect } from 'react';
import { ReportingService, type FetchPdfOptions, type ReportParams } from '~/services/reports/reports-service';

export interface UsePdfReportOptions extends Omit<FetchPdfOptions, 'endpoint'> {
  autoLoad?: boolean;
  initialParams?: ReportParams;
}

export interface UsePdfReportReturn {
  pdfUrl: string | null;
  loading: boolean;
  error: string | null;
  fetchPdf: (params?: ReportParams) => Promise<void>;
  downloadPdf: (filename?: string) => void;
  openInNewTab: () => void;
  clearPdf: () => void;
  setError: (error: string | null) => void;
}

export function usePdfReport(
  endpoint: string,
  options: UsePdfReportOptions = {}
): UsePdfReportReturn {
  const {
    autoLoad = false,
    initialParams = {},
    filename,
    autoOpen = false
  } = options;

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPdf = useCallback(async (params?: ReportParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = await ReportingService.fetchPdf({
        endpoint,
        params: params || initialParams,
        filename,
        autoOpen
      });
      
      setPdfUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [endpoint, initialParams, filename, autoOpen]);

  const downloadPdf = useCallback((customFilename?: string) => {
    if (!pdfUrl) return;
    ReportingService.downloadPdf(pdfUrl, customFilename || filename);
  }, [pdfUrl, filename]);

  const openInNewTab = useCallback(() => {
    if (!pdfUrl) return;
    ReportingService.openInNewTab(pdfUrl);
  }, [pdfUrl]);

  const clearPdf = useCallback(() => {
    if (pdfUrl) {
      ReportingService.revokeObjectUrl(pdfUrl);
      setPdfUrl(null);
    }
  }, [pdfUrl]);

  // Auto load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      fetchPdf();
    }
    
    return () => {
      if (pdfUrl) {
        ReportingService.revokeObjectUrl(pdfUrl);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    pdfUrl,
    loading,
    error,
    fetchPdf,
    downloadPdf,
    openInNewTab,
    clearPdf,
    setError,
  };
}