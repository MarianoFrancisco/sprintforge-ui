import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./dropdown-menu";
import { Button } from "./button";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderIcon = () => {
    if (!mounted) return <Monitor className="h-[1.2rem] w-[1.2rem]" />;

    return theme === Theme.DARK ? (
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    ) : (
      <Sun className="h-[1.2rem] w-[1.2rem]" />
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" type="button">
          {renderIcon()}
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
  );
}
