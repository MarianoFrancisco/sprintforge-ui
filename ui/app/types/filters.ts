// ~/types/filters.ts
export interface ComboboxOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  name: string;
  label: string;
  type: 'select' | 'combobox' | 'input' | 'date' | 'number' | 'checkbox';
  options?: ComboboxOption[];
  placeholder?: string;
  defaultValue?: string;
  // Para validaciones
  min?: number;
  max?: number;
}