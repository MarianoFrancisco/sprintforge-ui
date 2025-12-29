// ~/components/filters/FilterControls.tsx
import * as React from "react";
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

  // Función para actualizar un campo en el Form principal
  const updateFormField = (name: string, value: string) => {
    const form = document.querySelector('form[method="get"]') as HTMLFormElement;
    if (form) {
      let input = form.querySelector(`[name="${name}"]`) as HTMLInputElement;
      
      // Si no existe el input, crearlo
      if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
      }
      
      input.value = value;
    }
  };

  const renderFilterControl = (filter: FilterConfig) => {
    const defaultValue = searchParams.get(filter.name) || filter.defaultValue || '';

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.name} className="space-y-2">
            <Label htmlFor={filter.name}>{filter.label}</Label>
            <Select 
              name={filter.name} 
              defaultValue={defaultValue}
              onValueChange={(value) => updateFormField(filter.name, value)}
            >
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
                updateFormField(filter.name, value);
              }}
              placeholder={filter.placeholder || `Buscar ${filter.label.toLowerCase()}...`}
            />
          </div>
        );

      case 'date':
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
              onChange={(e) => updateFormField(filter.name, e.target.value)}
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
              onChange={(e) => updateFormField(filter.name, e.target.value)}
            />
          </div>
        );

      case 'checkbox':
        const isChecked = defaultValue === 'true';
        const [checked, setChecked] = React.useState(isChecked);
        
        return (
          <div key={filter.name} className="flex items-center space-x-2 space-y-0">
            <Checkbox
              id={filter.name}
              name={filter.name}
              checked={checked}
              onCheckedChange={(isChecked) => {
                const value = isChecked ? "true" : "false";
                setChecked(!!isChecked);
                updateFormField(filter.name, value);
              }}
            />
            <Label htmlFor={filter.name} className="cursor-pointer">
              {filter.label}
            </Label>
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
              onChange={(e) => updateFormField(filter.name, e.target.value)}
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