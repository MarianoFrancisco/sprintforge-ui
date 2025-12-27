import { BriefcaseBusiness, Users } from "lucide-react";
import { PERMS } from "~/config/permissions";
import type { NavItem } from "~/types/navbar/nav-item";

export const navMainData: NavItem[] = [
  {
    title: "Puestos",
    url: "/employees/positions",
    icon: Users,
    permission: PERMS.POSITION_VIEW, // para ver el módulo
    items: [
      { title: "Nuevo puesto", url: "/employees/positions/create", permission: PERMS.POSITION_CREATE },
      { title: "Listado", url: "/employees/positions", permission: PERMS.POSITION_VIEW },
    ],
  },
  {
    title: "Empleados",
    url: "/employees",
    icon: BriefcaseBusiness,
    permission: PERMS.EMPLOYEE_VIEW,
    items: [
      { title: "Contratar empleado", url: "/employees/hire", permission: PERMS.EMPLOYEE_HIRE },
      { title: "Listado", url: "/employees", permission: PERMS.EMPLOYEE_VIEW },
      { title: "Historial laboral", url: "/employees/history", permission: PERMS.EMPLOYEE_VIEW_WORK_HISTORY },
      { title: "Historial de pagos", url: "/employees/payments", permission: PERMS.EMPLOYEE_VIEW_PAYMENT_HISTORY },
    ],
  },
  {
    title: "Roles",
    url: "/identity/roles",
    icon: BriefcaseBusiness,
    permission: PERMS.ROLE_VIEW,
    items: [
      { title: "Crear rol", url: "/identity/roles/create", permission: PERMS.ROLE_CREATE },
      { title: "Listado", url: "/identity/roles", permission: PERMS.ROLE_VIEW },
    ],
  },
  {
    title: "Usuarios",
    url: "/identity/users",
    icon: Users,
    // permission: PERMS.USER_VIEW,
    items: [
      { title: "Listado", url: "/identity/users", permission: PERMS.USER_VIEW },
    ],
  },
];