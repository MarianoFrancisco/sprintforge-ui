import { useNavigate } from "react-router";
import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { UserResponseDTO } from "~/types/identity/user";

interface UserActionsProps {
  user: UserResponseDTO;
}

export function UserActions({ user }: UserActionsProps) {
  const navigate = useNavigate();
  const { id, status } = user;

  const isActive = status === "ACTIVE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted text-muted-foreground"
        >
          <Ellipsis />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {/* Cambiar rol */}
        <DropdownMenuItem
          disabled={!isActive}
          onClick={() => navigate(`/identity/users/${id}/change-role`)}
        >
          Cambiar rol
        </DropdownMenuItem>

        {!isActive && (
          <div className="px-2 py-1 text-xs text-muted-foreground">
            El usuario debe estar activo
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
