import React from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "~/components/ui/command";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "~/components/ui/collapsible";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { CommandInput } from "cmdk";

export type Permission = {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
};

interface PermissionSelectorProps {
  permissions: Permission[]; // lista total de permisos
  selected: string[]; // ids seleccionados
  onChange: (next: string[]) => void;
}

export default function PermissionSelector({ permissions, selected, onChange }: PermissionSelectorProps) {
  const permissionsByCategory = React.useMemo(() => {
    const map: Record<string, Permission[]> = {};
    permissions.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, [permissions]);

  const togglePermission = (id: string) => {
    const exists = selected.includes(id);
    if (exists) onChange(selected.filter((x) => x !== id));
    else onChange([...selected, id]);
  };

  return (
    <Command className="rounded-lg border shadow-sm w-full">
        {/* <CommandInput placeholder="Buscar permisos..." className="border-b" /> */}
      <CommandList>
        {Object.entries(permissionsByCategory).map(([category, items]) => (
          <Collapsible key={category} defaultOpen className="border-b last:border-none">
            <div className="flex items-center justify-between px-4 py-2">
              <h4 className="text-sm font-semibold">{category}</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <ChevronsUpDown />
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent>
              <CommandGroup className="px-2">
                {items.map((p) => (
                  <CommandItem key={p.id} className="flex items-center gap-3 py-3">
                    <Checkbox
                      checked={selected.includes(p.id)}
                      onCheckedChange={() => togglePermission(p.id)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{p.name}</span>
                      {p.description && (
                        <span className="text-xs text-muted-foreground">{p.description}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CommandList>
    </Command>
  );
}
