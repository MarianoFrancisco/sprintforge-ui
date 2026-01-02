// ~/components/filters/GenericFilter.tsx
import { Form } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search, X } from "lucide-react";
import type { FilterConfig } from "~/types/filters";
import { useFilters } from "~/hooks/use-filters";
import { AdvancedFiltersDialog } from "./advanced-filters-dialog";

interface GenericFilterProps {
  filters: FilterConfig[];
  searchPlaceholder?: string;
}

export function GenericFilter({
  filters,
  searchPlaceholder = "Buscar...",
}: GenericFilterProps) {
  const { clearAllFilters, searchParams } = useFilters();
  const hasActiveFilters = searchParams.toString() !== "";
  const hasAdvancedFilters = filters.length > 0;

  return (
    <div className="space-y-4">
      <Form method="get" className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            name="searchTerm"
            placeholder={searchPlaceholder}
            defaultValue={searchParams.get("searchTerm") || ""}
            className="w-full"
          />
        </div>

        <Button type="submit" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Buscar</span>
        </Button>

        {hasAdvancedFilters ? <AdvancedFiltersDialog filters={filters} /> : null}

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={() => clearAllFilters()}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Limpiar todo</span>
          </Button>
        )}

        {filters.map((filter) => {
          const value = searchParams.get(filter.name) || "";
          return (
            <input
              key={filter.name}
              type="hidden"
              name={filter.name}
              value={value}
            />
          );
        })}
      </Form>
    </div>
  );
}
