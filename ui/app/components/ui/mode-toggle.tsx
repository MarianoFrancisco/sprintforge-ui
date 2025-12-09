import { Monitor, Moon, Sun } from "lucide-react"
import { Theme, useTheme } from "remix-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { Button } from "./button"

export function ModeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" /> */}
          {theme === Theme.DARK ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : theme === Theme.LIGHT ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : 
          <Monitor className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          Oscuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(null)}>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}