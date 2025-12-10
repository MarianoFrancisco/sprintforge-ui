"use client"

import * as React from "react"
import {
  BriefcaseBusiness,
  LifeBuoy,
  Send,
  Users,
} from "lucide-react"

import { NavMain } from "~/components/nav-main"
import { NavSecondary } from "~/components/nav-secondary"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { Link } from "react-router"

const data = {
  user: {
    name: "shadcn",
    email: "admin@sprintforge.com",
    avatar: "https://picsum.photos/400/400",
  },
  navMain: [
    {
      title: "Cargos",
      url: "/employees/positions",
      icon: Users,
      items: [
        {
          title: "Nuevo cargo",
          url: "/employees/positions/create",
        },
        {
          title: "Listado",
          url: "/employees/positions",
        },
      ],
    },
     {
      title: "Empleados",
      url: "/employees",
      icon: BriefcaseBusiness,
      items: [
        {
          title: "Contratar empleado",
          url: "/employees/hire",
        },
        {
          title: "Listado",
          url: "/employees",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <img
                    src="/logo.svg"
                    alt="Sprint Forge Logo"
                    className="h-10 w-10 rounded-lg object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-base font-bold">SPRINT FORGE</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
