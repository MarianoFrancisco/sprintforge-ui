// ~/components/sprints/sprint-selector.tsx
import * as React from "react";
import { Check, RefreshCw } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";

export interface SprintSelectorOption {
  value: string; // sprintId
  label: string; // sprint name
}

type SprintSelectorProps = {
  options: SprintSelectorOption[];
  value?: string; // ninguno por defecto
  onChange: (sprintId: string) => void;

  placeholder?: string;
  className?: string;

  /** Tooltip accesible (title) para el trigger */
  triggerLabel?: string;
};

export function SprintSelector({
  options,
  value = "",
  onChange,
  placeholder = "Cambiar sprint",
  className,
  triggerLabel = "Cambiar sprint",
}: SprintSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = value
    ? options.find((o) => o.value === value)?.label
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Trigger: solo ícono, estilo "Change" */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          role="combobox"
          aria-label={triggerLabel}
          aria-expanded={open}
          title={triggerLabel}
          className={cn("shrink-0", className)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="end">
        <Command
          filter={(cmdValue, search) => {
            const opt = options.find((o) => o.value === cmdValue);
            if (!opt) return 0;
            return opt.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <div className="px-3 pt-3 pb-2 text-sm font-medium">
            {selectedLabel ? `Sprint: ${selectedLabel}` : placeholder}
          </div>

          <CommandInput placeholder="Buscar sprint..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron sprints.</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    // No deselecciona (comportamiento típico de selector)
                    if (currentValue !== value) onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
