// ~/components/filters/AdvancedFiltersDialog.tsx
import { Button } from "~/components/ui/button";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useFilters } from "~/hooks/use-filters";
import type { FilterConfig } from "~/types/filters";
import { FilterControls } from "./filter-controls";

interface AdvancedFiltersDialogProps {
  filters: FilterConfig[];
  title?: string;
}

export function AdvancedFiltersDialog({ 
  filters, 
  title = "Filtros avanzados" 
}: AdvancedFiltersDialogProps) {
  const { activeFiltersCount } = useFilters();

  // Esta función se encarga de enviar el formulario principal PARPADEO
  const handleApplyFilters = () => {
    // Encontrar y enviar el formulario principal
    const form = document.querySelector('form[method="get"]') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 relative"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount() > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount()}
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {/* NO usar Form aquí, solo controles */}
        <FilterControls filters={filters} />
        
        <DialogFooter className="gap-2 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button 
              type="button" 
              onClick={handleApplyFilters}
            >
              Aplicar filtros
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}