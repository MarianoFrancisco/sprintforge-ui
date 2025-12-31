// ~/components/employee/employee-combobox.tsx
import * as React from "react"
import { AtSign, Check, ChevronsUpDown, X } from "lucide-react"
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

import { EmployeeChip } from "../scrum/project/employee-chip"
import { EmployeeItem } from "../scrum/project/employee-item"
import type { EmployeeResultResponseDTO } from "~/types/scrum/project"

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
}

interface EmployeeComboboxProps {
  employees: EmployeeResultResponseDTO[]
  value?: string | null
  onChange: (nextValue: string | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
}

export function EmployeeCombobox({
  employees,
  value,
  onChange,
  placeholder = "Buscar por correo o nombre...",
  className,
  disabled,
  clearable = true,
}: EmployeeComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedEmployee = React.useMemo(() => {
    if (!value) return null
    return employees.find((e) => e.id === value) ?? null
  }, [employees, value])

  function select(id: string) {
    if (disabled) return
    onChange(id)
    setOpen(false)
  }

  function clear(e?: React.MouseEvent) {
    e?.preventDefault()
    e?.stopPropagation()
    if (disabled) return
    onChange(null)
  }

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* Trigger tipo combobox: si hay seleccionado -> chip; si no -> botón placeholder */}
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between gap-2",
              "h-auto min-h-10 px-3 py-2",
              selectedEmployee ? "items-start" : "items-center"
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {selectedEmployee ? (
                // Solo mostramos la chip del seleccionado
                <EmployeeChip
                  employee={selectedEmployee}
                  disabled={disabled}
                  // opcional: permitir quitar sin abrir el popover
                  showRemoveButton={false}
                  onRemove={clearable ? () => onChange(null) : undefined}
                  className="max-w-full"
                />
              ) : (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <AtSign className="h-4 w-4" />
                  <span className="truncate">{placeholder}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {selectedEmployee && clearable ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={clear}
                  disabled={disabled}
                  aria-label="Quitar empleado seleccionado"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}

              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn(
            "w-[--radix-popover-trigger-width] p-0",
            "min-w-[260px] max-w-[calc(100vw-2rem)]"
          )}
        >
          <Command
            filter={(empId, search) => {
              const emp = employees.find((e) => e.id === empId)
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
                {employees.map((e) => (
                  <CommandItem
                    key={e.id}
                    value={e.id}
                    onSelect={() => select(e.id)}
                    className="py-2"
                  >
                    <div className="flex w-full min-w-0 items-center justify-between gap-3">
                      <EmployeeItem employee={e} />

                      <div className="w-24 shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Check
                            className={cn(
                              "h-4 w-4",
                              value === e.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {value === e.id ? "Seleccionado" : "Elegir"}
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
    </div>
  )
}
