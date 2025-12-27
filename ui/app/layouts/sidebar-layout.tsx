import { ArrowLeftCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { AppSidebar } from "~/components/app-sidebar"
import { Button } from "~/components/ui/button"
import { ModeToggle } from "~/components/ui/mode-toggle"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function SidebarLayout() {

      const navigate = useNavigate()
  const [canGoBack, setCanGoBack] = useState(false)

  // Solo en el cliente verificamos si hay historial para volver
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.state && window.history.state.idx > 0)
    }
  }, [])

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1)
    } else {
      navigate("/")
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar />
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
