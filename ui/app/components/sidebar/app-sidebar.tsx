import * as React from "react"

import { NavMain } from "~/components/sidebar/nav-main"
import { NavUser } from "~/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { Link } from "react-router"
import { Theme, useTheme } from "remix-themes"
import { filterNavByPermissions } from "~/lib/nav-filter"
import { navMainData } from "./nav-main-data"
import type { User } from "~/types/identity/auth"
import { NavProjects } from "./nav-user-projects"
import type { ProjectResponseDTO } from "~/types/scrum/project"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User;
  projects?: ProjectResponseDTO[];
};

const mapProjectsToNavFormat = (
  projects: ProjectResponseDTO[]
): { name: string; url: string }[] => {
  return projects.map(project => ({
    name: project.name,
    url: `/projects/${project.id}`
  }));
};

export function AppSidebar({ user, projects, ...props }: AppSidebarProps) {
  const [theme] = useTheme();
  const filteredNavMain = React.useMemo(
    () => filterNavByPermissions(navMainData, user),
    [user],
  );

  const sidebarUser = {
    name: user.fullname,
    email: user.email,
    avatar: user.profileImage,
  };

    // Mapear proyectos al formato requerido
  const mappedProjects = React.useMemo(() => {
    const projectsToMap = projects ?? [];
    return mapProjectsToNavFormat(projectsToMap);
  }, [projects]);

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
                    className={`h-10 w-10 rounded-lg object-contain ${theme === Theme.LIGHT && 'bg-background'}`}
                  />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-xl font-bold">SPRINT FORGE</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={mappedProjects} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
