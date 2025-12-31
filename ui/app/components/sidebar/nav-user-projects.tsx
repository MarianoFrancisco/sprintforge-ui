// ~/components/nav-projects.tsx
import * as React from "react"
import { Link, useNavigate } from "react-router"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"

import { Combobox, type ComboboxOption } from "../common/combobox-option"

type ProjectNavItem = {
  name: string
  url: string
}

export function NavProjects({
  projects,
  defaultVisibleCount = 5,
}: {
  projects: ProjectNavItem[]
  defaultVisibleCount?: number
}) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  // Siempre los primeros N
  const visibleProjects = React.useMemo(
    () => projects.slice(0, defaultVisibleCount),
    [projects, defaultVisibleCount]
  )

  // Combobox con TODOS
  const options: ComboboxOption[] = React.useMemo(
    () => projects.map((p) => ({ value: p.url, label: p.name })),
    [projects]
  )

  // Si no hay "resto", no mostramos "More"
  const showMoreSection = projects.length > defaultVisibleCount

  // Opcional: mantener seleccionado en UI del combobox (no afecta el orden)
  const [selectedUrl, setSelectedUrl] = React.useState("")

  // Si cambia la lista y el seleccionado ya no existe, lo limpiamos
  React.useEffect(() => {
    if (selectedUrl && !projects.some((p) => p.url === selectedUrl)) {
      setSelectedUrl("")
    }
  }, [projects, selectedUrl])

  function handleSelectFromCombobox(url: string) {
    setSelectedUrl(url)
    if (url) navigate(url)
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Proyectos</SidebarGroupLabel>

      <SidebarMenu>
        {visibleProjects.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        {showMoreSection && (
          <SidebarMenuItem>
              <Combobox
                options={options}
                value={selectedUrl}
                onChange={handleSelectFromCombobox}
                placeholder="Buscar proyecto"
              />
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
