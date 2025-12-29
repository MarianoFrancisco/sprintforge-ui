import React from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandSeparator,
} from "~/components/ui/command";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { PermissionItem } from "./permission-item";

export type Permission = {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
};

interface PermissionSelectorProps {
  permissions: Permission[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export default function PermissionSelector({
  permissions,
  selected,
  onChange,
}: PermissionSelectorProps) {
  const permissionsByCategory = React.useMemo(() => {
    const map: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [permissions]);

  const allIds = React.useMemo(() => permissions.map((p) => p.id), [permissions]);

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const selectedCount = React.useMemo(() => {
    let count = 0;
    for (const id of allIds) if (selectedSet.has(id)) count++;
    return count;
  }, [allIds, selectedSet]);

  const allChecked = allIds.length > 0 && selectedCount === allIds.length;
  const noneChecked = selectedCount === 0;
  const isIndeterminate = !allChecked && !noneChecked;

  const toggleAll = () => {
    onChange(allChecked ? [] : allIds);
  };

  const clearAll = () => onChange([]);

  const togglePermission = (id: string) => {
    onChange(
      selectedSet.has(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  const categories = Object.entries(permissionsByCategory);

  return (
    <Command className="rounded-lg border shadow-md w-full">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-3 px-3 pt-3">
        <label
          className="flex items-center gap-2 text-sm font-medium select-none"
          onClick={(e) => e.preventDefault()}
        >
          <Checkbox
            checked={allChecked ? true : isIndeterminate ? "indeterminate" : false}
            onCheckedChange={() => toggleAll()}
          />
          Seleccionar todos
          <span className="text-xs text-muted-foreground">
            ({selectedCount}/{allIds.length})
          </span>
        </label>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            clearAll();
          }}
          disabled={noneChecked}
        >
          Limpiar
        </Button>
      </div>

      <div className="px-2 pt-2">
        <CommandInput placeholder="Buscar permisos..." />
      </div>

      <CommandList>
        <CommandEmpty>No se encontraron permisos.</CommandEmpty>

        {categories.map(([category, items], index) => (
          <React.Fragment key={category}>
            <CommandGroup heading={category}>
              {items.map((p) => (
                <CommandItem key={p.id} value={`${p.name} ${p.code}`}>
                  <PermissionItem
                    name={p.name}
                    description={p.description}
                    checked={selectedSet.has(p.id)}
                    onCheckedChange={() => togglePermission(p.id)}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            {index < categories.length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}
      </CommandList>
    </Command>
  );
}
