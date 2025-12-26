// ~/components/filters/GenericFilter.tsx
import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";
import type { FilterConfig } from "~/types/filters";
import { useFilters } from "~/hooks/use-filters";
import { AdvancedFiltersDialog } from "./advanced-filters-dialog";

interface GenericFilterProps {
  filters: FilterConfig[];
  searchPlaceholder?: string;
}

export function GenericFilter({ 
  filters, 
  searchPlaceholder = "Buscar..." 
}: GenericFilterProps) {
  const { clearAllFilters, searchParams } = useFilters();
  const hasActiveFilters = searchParams.toString() !== '';

  return (
    <div className="space-y-4">
      <Form method="get" className="flex items-center gap-3">
        {/* Campo de búsqueda principal */}
        <div className="flex-1">
          <Input
            name="searchTerm"
            placeholder={searchPlaceholder}
            defaultValue={searchParams.get('searchTerm') || ''}
            className="w-full"
          />
        </div>

        {/* Botón buscar */}
        <Button type="submit" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>

        {/* Dialog de filtros avanzados */}
        <AdvancedFiltersDialog filters={filters} />

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={() => clearAllFilters()}
            className="whitespace-nowrap"
          >
            Limpiar todo
          </Button>
        )}
      </Form>
    </div>
  );
}