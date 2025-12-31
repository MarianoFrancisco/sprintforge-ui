import { ArrowLeftCircle } from "lucide-react"
import { Outlet, redirect, useLoaderData, useNavigate, useOutletContext, type LoaderFunctionArgs, type MiddlewareFunction } from "react-router"
import { AppSidebar } from "~/components/sidebar/app-sidebar"
import { Button } from "~/components/ui/button"
import { ModeToggle } from "~/components/ui/mode-toggle"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { userContext } from "~/context/user-context"
import { userProjectsContext } from "~/context/user-project-context"
import type { UserOutletContext } from "~/hooks/use-user"
import { authMiddleware } from "~/middlewares/auth-middleware"

export const middleware: MiddlewareFunction[] = [
  authMiddleware,
];

export async function loader({ context }: LoaderFunctionArgs) {
  const user = context.get(userContext);
  if (!user) throw redirect("/login");
  const projects = context.get(userProjectsContext);
  return { user, projects };
}

export default function SidebarLayout() {
  const { user, projects } = useLoaderData<typeof loader>();
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }
  return (
    <SidebarProvider>
      <AppSidebar user={user} projects={projects}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="ml-2 flex items-center gap-1"
            >
              <ArrowLeftCircle className="h-4 w-4" />
              Regresar
            </Button>
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>
        </header>
          <div className="p-4">
            <Outlet context={{ user } satisfies UserOutletContext} />
          </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
