import { Form, useNavigate, useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function PositionFilter() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <Form
      method="get"
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-card shadow-sm items-end"
    >
      {/* Buscar por término */}
      <div className="grid gap-1">
        <Label htmlFor="searchTerm">Cargo</Label>
        <Input
          id="searchTerm"
          name="searchTerm"
          placeholder="Nombre o descripción"
          defaultValue={searchParams.get("searchTerm") ?? ""}
        />
      </div>

      {/* Estado activo / inactivo */}
      <div className="grid gap-1">
        <Label htmlFor="isActive">Estado</Label>
        <Select
          name="isActive"
          defaultValue={searchParams.get("isActive") ?? "all"}
        >
          <SelectTrigger id="isActive" className="w-full">
            <SelectValue placeholder="Selecciona un estado" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Eliminados */}
      <div className="grid gap-1">
        <Label htmlFor="isDeleted">Eliminados</Label>
        <Select
          name="isDeleted"
          defaultValue={searchParams.get("isDeleted") ?? "all"}
        >
          <SelectTrigger id="isDeleted" className="w-full">
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Eliminados</SelectItem>
            <SelectItem value="false">No eliminados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <Button type="submit" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>

        <Button
          type="reset"
          variant="outline"
          onClick={() => navigate("/employees/positions")}
        >
          Limpiar
        </Button>
      </div>
    </Form>
  );
}
