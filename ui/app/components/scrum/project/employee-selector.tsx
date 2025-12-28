// components/employee/employee-selector.tsx
import * as React from "react"
import { AtSign, Check } from "lucide-react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

import type { EmployeeResponseDTO } from "~/types/employees/employee"
import { EmployeeItem } from "./employee-item"
import { EmployeeChip } from "./employee-chip"

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
}

interface EmployeeSelectorProps {
  employees: EmployeeResponseDTO[]
  selected: string[]
  onChange: (nextSelected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxSelected?: number
}

export function EmployeeSelector({
  employees,
  selected,
  onChange,
  placeholder = "Buscar por correo o nombre...",
  className,
  disabled,
  maxSelected,
}: EmployeeSelectorProps) {
  const [open, setOpen] = React.useState(false)

  const selectedSet = React.useMemo(() => new Set(selected), [selected])

  const selectedEmployees = React.useMemo(
    () => employees.filter((e) => selectedSet.has(e.id)),
    [employees, selectedSet]
  )

  const availableEmployees = React.useMemo(
    () => employees.filter((e) => !selectedSet.has(e.id)),
    [employees, selectedSet]
  )

  const canAddMore = maxSelected ? selected.length < maxSelected : true

  function add(id: string) {
    if (disabled) return
    if (!canAddMore) return
    if (selectedSet.has(id)) return
    onChange([...selected, id])
  }

  function remove(id: string) {
    if (disabled) return
    onChange(selected.filter((x) => x !== id))
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Contenedor tipo input (responsive y más compacto) */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-md p-2",
          disabled && "opacity-70"
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || !canAddMore}
              className="h-8 shrink-0"
            >
              <AtSign className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </PopoverTrigger>

          {/* Popover responsivo: mismo ancho del trigger contenedor */}
          <PopoverContent
            align="start"
            className={cn(
              "w-[--radix-popover-trigger-width] p-0",
              "min-w-[260px] max-w-[calc(100vw-2rem)]"
            )}
          >
            <Command
              filter={(value, search) => {
                const emp = availableEmployees.find((e) => e.id === value)
                if (!emp) return 0
                const haystack = normalize(`${emp.email} ${emp.fullName}`)
                const needle = normalize(search)
                return haystack.includes(needle) ? 1 : 0
              }}
            >
              <CommandInput placeholder={placeholder} className="h-9" />
              <CommandList>
                <CommandEmpty>No se encontraron empleados.</CommandEmpty>

                <CommandGroup>
                  {availableEmployees.map((e) => (
                    <CommandItem
                      key={e.id}
                      value={e.id}
                      onSelect={() => add(e.id)}
                      // Controlamos el layout del item para que la acción quede fija a la derecha
                      className="py-2"
                    >
                      <div className="flex w-full min-w-0 items-center justify-between gap-3">
                        <EmployeeItem employee={e} />

                        {/* Acción fija, no se “corre” */}
                        <div className="w-16 shrink-0 text-right">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Check className="h-4 w-4 opacity-0" />
                            Agregar
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Chips */}
        {selectedEmployees.map((e) => (
          <EmployeeChip
            key={e.id}
            employee={e}
            disabled={disabled}
            onRemove={remove}
            className="max-w-full"
          />
        ))}

        {!canAddMore ? (
          <span className="text-xs text-muted-foreground">Límite alcanzado</span>
        ) : null}
      </div>
    </div>
  )
}
