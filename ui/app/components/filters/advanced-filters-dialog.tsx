// ~/components/filters/AdvancedFiltersDialog.tsx
import { Form } from "react-router";
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

// ¡IMPORTANTE! Esta interfaz debe estar definida
interface AdvancedFiltersDialogProps {
  filters: FilterConfig[];
  title?: string;
}

export function AdvancedFiltersDialog({ 
  filters, 
  title = "Filtros avanzados" 
}: AdvancedFiltersDialogProps) { // <-- Acepta las props
  const { activeFiltersCount } = useFilters();

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
        
        <Form method="get">
          <FilterControls filters={filters} />
          
          <DialogFooter className="gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">
                Aplicar filtros
              </Button>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}