// services/reportingService.ts
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8006";

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

const BASE_REPORT_URL = reportingEndpoint(API_BASE_URL);

export interface ReportParams {
  [key: string]: string | number | boolean | Date | undefined;
}

export interface FetchPdfOptions {
  endpoint: string;
  params?: ReportParams;
  filename?: string;
  autoOpen?: boolean;
}

export class ReportingService {
  static async fetchPdf({
    endpoint,
    params,
    filename = "reporte.pdf",
    autoOpen = false
  }: FetchPdfOptions): Promise<string | null> {
    try {
      // Construir URL con parámetros
      let url = joinUrl(BASE_REPORT_URL, endpoint);
      
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof Date) {
              searchParams.append(key, value.toISOString().split('T')[0]);
            } else {
              searchParams.append(key, String(value));
            }
          }
        });
        
        url += `?${searchParams.toString()}`;
      }
      
      // Obtener token (ajusta según tu implementación)
      const token = localStorage.getItem('token') || '';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      
      toast.success("PDF generado correctamente");
      
      if (autoOpen) {
        window.open(objectUrl, '_blank', 'noopener,noreferrer');
      }
      
      return objectUrl;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`Error al generar el PDF: ${errorMessage}`);
      console.error('Error fetching PDF:', error);
      return null;
    }
  }

  static downloadPdf(url: string, filename: string = "reporte.pdf") {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static openInNewTab(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  static revokeObjectUrl(url: string) {
    if (url && url.startsWith('blob:')) {
      window.URL.revokeObjectURL(url);
    }
  }
}

export const REPORT_ENDPOINTS = {
  ROLE_GENERAL: 'role-general.pdf',
  INCOME: 'income.pdf',
  HIRING_HISTORY: 'hiring-history.pdf',
  // Agrega más endpoints aquí según necesites
} as const;