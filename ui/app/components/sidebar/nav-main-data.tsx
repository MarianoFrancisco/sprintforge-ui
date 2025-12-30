import { BriefcaseBusiness, FileDown, FolderCog, IdCard, ShieldUser, Users } from "lucide-react";
import { PERMS } from "~/config/permissions";
import type { NavItem } from "~/types/navbar/nav-item";

export const navMainData: NavItem[] = [
  {
    title: "Puestos",
    url: "/employees/positions",
    icon: BriefcaseBusiness,
    permission: PERMS.POSITION_VIEW, // para ver el módulo
    items: [
      { title: "Nuevo puesto", url: "/employees/positions/create", permission: PERMS.POSITION_CREATE },
      { title: "Listado", url: "/employees/positions", permission: PERMS.POSITION_VIEW },
    ],
  },
  {
    title: "Empleados",
    url: "/employees",
    icon: IdCard,
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
    icon: ShieldUser,
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
    permission: PERMS.USER_VIEW,
    items: [
      { title: "Listado", url: "/identity/users", permission: PERMS.USER_VIEW },
    ],
  },
  {
    title: "Proyectos",
    url: "/projects",
    icon: FolderCog,
    permission: PERMS.PROJECT_VIEW,
    items: [
      { title: "Crear proyecto", url: "/projects/create", permission: PERMS.PROJECT_CREATE },
      { title: "Listado", url: "/projects", permission: PERMS.PROJECT_VIEW },
      { title: "Historial de pagos", url: "/projects/payments", permission: PERMS.PROJECT_VIEW_PAYMENT_HISTORY },
    ],
  },
    {
    title: "Reportes",
    url: "#",
    icon: FileDown,
    // permission: PERMS.PROJECT_VIEW,
    items: [
      {title: "Avance de proyectos", url: "/reports/project-progress", permission: PERMS.REPORT_PROJECT_PROGRESS},
      { title: "Contrataciones", url: "/reports/hiring-history", permission: PERMS.REPORT_HIRING_HISTORY },
      { title: "Bajas empleados", url: "/reports/termination-history", permission: PERMS.REPORT_TERMINATION_HISTORY },
      { title: "Roles", url: "/reports/role-general", permission: PERMS.REPORT_ROLE_GENERAL },
      { title: "Ingresos", url: "/reports/incomes", permission: PERMS.REPORT_INCOMES },
      { title: "Ganancias", url: "/reports/profits", permission: PERMS.REPORT_PROFITS },
      { title: "Gastos", url: "/reports/expenses", permission: PERMS.REPORT_EXPENSES },
    ],
  },
];