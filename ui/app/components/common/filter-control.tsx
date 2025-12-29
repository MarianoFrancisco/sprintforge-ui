// ~/components/filters/FilterControls.tsx
import { useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface FilterControl {
  name: string;
  label: string;
  type: "select" | "input";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// Configuración de filtros (fácil de extender)
const FILTER_CONFIG: FilterControl[] = [
  {
    name: "isActive",
    label: "Estado",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "true", label: "Activos" },
      { value: "false", label: "Inactivos" },
    ],
    placeholder: "Selecciona un estado",
  },
  {
    name: "isDeleted",
    label: "Eliminados",
    type: "select",
    options: [
      { value: "all", label: "Todos" },
      { value: "true", label: "Eliminados" },
      { value: "false", label: "No eliminados" },
    ],
    placeholder: "Selecciona una opción",
  },
  // Puedes agregar más filtros aquí fácilmente
];

export function FilterControls() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("searchTerm") ?? "";

  return (
    <div className="space-y-4 py-2">
      {/* Campo de búsqueda en el dialog también */}
      <div className="space-y-2">
        <Label htmlFor="dialog-searchTerm">Término de búsqueda</Label>
        <Input
          id="dialog-searchTerm"
          name="searchTerm"
          defaultValue={searchTerm}
          placeholder="Nombre o descripción"
        />
      </div>

      {/* Renderizar filtros configurados */}
      {FILTER_CONFIG.map((filter) => {
        const defaultValue = searchParams.get(filter.name) || "all";

        if (filter.type === "select") {
          return (
            <div key={filter.name} className="space-y-2">
              <Label htmlFor={filter.name}>{filter.label}</Label>
              <Select name={filter.name} defaultValue={defaultValue}>
                <SelectTrigger id={filter.name}>
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        // Para inputs de texto (si agregas en el futuro)
        return (
          <div key={filter.name} className="space-y-2">
            <Label htmlFor={filter.name}>{filter.label}</Label>
            <Input
              id={filter.name}
              name={filter.name}
              defaultValue={searchParams.get(filter.name) || ""}
              placeholder={filter.placeholder}
            />
          </div>
        );
      })}
    </div>
  );
}