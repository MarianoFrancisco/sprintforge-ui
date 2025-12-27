import { BriefcaseBusiness, Users } from "lucide-react";
import { PERMS } from "~/config/permissions";
import type { NavItem } from "~/types/navbar/nav-item";

export const navMainData: NavItem[] = [
  {
    title: "Puestos",
    url: "/employees/positions",
    icon: Users,
    permission: PERMS.POSITION_LIST, // para ver el módulo
    items: [
      { title: "Nuevo puesto", url: "/employees/positions/create", permission: PERMS.POSITION_CREATE },
      { title: "Listado", url: "/employees/positions", permission: PERMS.POSITION_LIST },
    ],
  },
  {
    title: "Empleados",
    url: "/employees",
    icon: BriefcaseBusiness,
    permission: PERMS.EMPLOYEE_LIST,
    items: [
      { title: "Contratar empleado", url: "/employees/hire", permission: PERMS.EMPLOYEE_CREATE },
      { title: "Listado", url: "/employees", permission: PERMS.EMPLOYEE_LIST },
      { title: "Historial laboral", url: "/employees/history" },
      { title: "Historial de pagos", url: "/employees/payments" },
    ],
  },
  {
    title: "Roles",
    url: "/identity/roles",
    icon: BriefcaseBusiness,
    permission: PERMS.ROLE_LIST,
    items: [
      { title: "Crear rol", url: "/identity/roles/create", permission: PERMS.ROLE_CREATE },
      { title: "Listado", url: "/identity/roles", permission: PERMS.ROLE_LIST },
    ],
  },
];