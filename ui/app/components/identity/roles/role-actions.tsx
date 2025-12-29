// ~/components/roles/role-actions.tsx
import { Form, useNavigate } from "react-router";
import { Ban, CheckCircle, Ellipsis, Pencil } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { RoleResponseDTO } from "~/types/identity/role";

interface RoleActionsProps {
  role: RoleResponseDTO;
}

export function RoleActions({ role }: RoleActionsProps) {
  const navigate = useNavigate();
  const { id, isActive } = role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted text-muted-foreground"
          disabled={role.isDefault}
        >
          <Ellipsis />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {/* Editar */}
        <DropdownMenuItem onClick={() => navigate(`/identity/roles/${id}/edit`)}>
          <Pencil  className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        {isActive ? (
          <Form method="post" action={`/identity/roles/${id}/deactivate`}>
            <DropdownMenuItem asChild>
              <button type="submit" className="w-full text-left">
                <Ban className="mr-2 h-4 w-4" />
                Desactivar
              </button>
            </DropdownMenuItem>
          </Form>
        ) : (
          <Form method="post" action={`/identity/roles/${id}/activate`}>
            <DropdownMenuItem asChild>
              <button type="submit" className="w-full text-left">
                <CheckCircle className="mr-2 h-4 w-4" />
                Activar
              </button>
            </DropdownMenuItem>
          </Form>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
