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

  const togglePermission = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  const categories = Object.entries(permissionsByCategory);

  return (
    <Command className="rounded-lg border shadow-md w-full">
      {/* EXACTAMENTE como la doc */}
      <CommandInput placeholder="Buscar permisos..." />

      <CommandList>
        <CommandEmpty>No se encontraron permisos.</CommandEmpty>

        {categories.map(([category, items], index) => (
          <React.Fragment key={category}>
            <CommandGroup heading={category}>
              {items.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.code}`}
                >
                  <PermissionItem
                    name={p.name}
                    description={p.description}
                    checked={selected.includes(p.id)}
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
