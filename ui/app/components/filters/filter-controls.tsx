import { useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { FilterConfig } from "~/types/filters";
import { Combobox } from "../common/combobox-option";

interface FilterControlsProps {
  filters: FilterConfig[];
}

export function FilterControls({ filters }: FilterControlsProps) {
  const [searchParams] = useSearchParams();

  const renderFilterControl = (filter: FilterConfig) => {
    const defaultValue = searchParams.get(filter.name) || filter.defaultValue || '';

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.name} className="space-y-2">
            <Label htmlFor={filter.name}>{filter.label}</Label>
            <Select name={filter.name} defaultValue={defaultValue}>
              <SelectTrigger id={filter.name}>
                <SelectValue placeholder={filter.placeholder || `Selecciona ${filter.label.toLowerCase()}`} />
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

      case 'combobox':
        const currentValue = searchParams.get(filter.name) || '';
        
        return (
          <div key={filter.name} className="space-y-2">
            <Label htmlFor={filter.name}>{filter.label}</Label>
            <Combobox
              options={filter.options || []}
              value={currentValue}
              onChange={(value) => {
                // Actualizar input hidden
                const input = document.querySelector(`input[name="${filter.name}"]`) as HTMLInputElement;
                if (input) input.value = value;
              }}
              placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
            />
            <input 
              type="hidden" 
              name={filter.name} 
              value={currentValue} 
            />
          </div>
        );

      case 'date':
        // Para fechas, usar formato YYYY-MM-DD que es compatible con Java LocalDate
        const dateValue = searchParams.get(filter.name) || '';
        
        return (
          <div key={filter.name} className="space-y-2">
            <Label htmlFor={filter.name}>{filter.label}</Label>
            <Input
              id={filter.name}
              name={filter.name}
              type="date"
              defaultValue={dateValue}
              placeholder={filter.placeholder}
            />
          </div>
        );

      case 'number':
        return (
          <div key={filter.name} className="space-y-2">
            <Label htmlFor={filter.name}>{filter.label}</Label>
            <Input
              id={filter.name}
              name={filter.name}
              type="number"
              defaultValue={defaultValue}
              placeholder={filter.placeholder}
              min={filter.min}
              max={filter.max}
              step="any"
            />
          </div>
        );

      case 'checkbox':
        const isChecked = defaultValue === 'true';
        return (
          <div key={filter.name} className="flex items-center space-x-2 space-y-0">
            <Checkbox
              id={filter.name}
              name={filter.name}
              defaultChecked={isChecked}
              onCheckedChange={(checked) => {
                const input = document.querySelector(`input[name="${filter.name}"]`) as HTMLInputElement;
                if (input) input.value = checked ? "true" : "false";
              }}
            />
            <Label htmlFor={filter.name} className="cursor-pointer">
              {filter.label}
            </Label>
            <input 
              type="hidden" 
              name={filter.name} 
              value={isChecked ? "true" : "false"} 
            />
          </div>
        );

      case 'input':
      default:
        return (
          <div key={filter.name} className="space-y-2">
            <Label htmlFor={filter.name}>{filter.label}</Label>
            <Input
              id={filter.name}
              name={filter.name}
              defaultValue={defaultValue}
              placeholder={filter.placeholder}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 py-2">
      {filters.map(renderFilterControl)}
    </div>
  );
}