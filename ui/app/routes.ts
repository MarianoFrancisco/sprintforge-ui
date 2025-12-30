import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("logout", "routes/logout.tsx"),
    route("identity/set-initial-password/:userId", "routes/identity/set-initial-password.tsx"),
    layout("layouts/sidebar-layout.tsx", [
        route("dashboard", "routes/dashboard.tsx"),

        ...prefix("reports", [
            route("project-progress", "routes/reports/project-progress-report.tsx"),
            route("hiring-history", "routes/reports/hiring-report.tsx"),
            route("termination-history", "routes/reports/termination-history-report.tsx"),
            route("role-general", "routes/reports/role-report.tsx"),
            route("incomes", "routes/reports/income-report.tsx"),
            route("expenses", "routes/reports/expense-report.tsx"),
            route("profits", "routes/reports/profit-report.tsx"),
        ]),

        ...prefix("employees", [
            index("routes/employees/index-employee.tsx"),
            route("hire", "routes/employees/hire-employee.tsx"),
            route("history", "routes/employees/employment-history.tsx"),
            route(":id/edit", "routes/employees/edit-employee.tsx"),
            route(":id/salary/increase", "routes/employees/increase-salary.tsx"),
            route(":cui/suspend", "routes/employees/suspend-employee.tsx"),
            route(":cui/reinstate", "routes/employees/reinstate-employee.tsx"),
            route(":cui/terminate", "routes/employees/terminate-employee.tsx"),

            route(":cui/pay", "routes/employees/payments/pay-employee.tsx"),
            route("payments", "routes/employees/payments/employee-payments-history.tsx"),

            ...prefix("positions", [
                index("routes/employees/positions/index-position.tsx"),
                route("create", "routes/employees/positions/create-position.tsx"),
                route(":id/edit", "routes/employees/positions/edit-position.tsx"),
            ]),
        ]),
        ...prefix("identity", [
            ...prefix("roles", [
                index("routes/identity/roles/index-role.tsx"),
                route("create", "routes/identity/roles/create-role.tsx"),
                route(":id/edit", "routes/identity/roles/edit-role.tsx"),
                route(":id/activate", "routes/identity/roles/activate-role.tsx"),
                route(":id/deactivate", "routes/identity/roles/deactivate-role.tsx"),
            ]),

            ...prefix("users", [
                index("routes/identity/users/index-user.tsx"),
                route(":id/change-role", "routes/identity/users/change-user-role.tsx"),
            ])
        ]),

        ...prefix("projects", [
            index("routes/scrum/project/index-project.tsx"),
            route("create", "routes/scrum/project/create-project.tsx"),
            route(":id/close", "routes/scrum/project/close-project.tsx"),
            route(":id/open", "routes/scrum/project/open-project.tsx"),
            route(":id/payment", "routes/scrum/project/create-project-payment.tsx"),
            route("payments", "routes/scrum/project/project-payments-history.tsx"),

            ...prefix(":projectId", [
                layout("layouts/project-layout.tsx", [
                    index("routes/scrum/project/by-id/project-home.tsx"),
                    route("work-items/create/:sprintId?/:boardColumnId?", "routes/scrum/project/by-id/work-item/create-work-item.tsx"),
                    route("sprint/create", "routes/scrum/project/by-id/sprint/create-sprint.tsx"),
                    route("backlog", "routes/scrum/project/by-id/project-backlog.tsx"),
                    route("backlog/work-items/:workItemId/move-to-sprint", "routes/scrum/project/by-id/work-item/work-item-move-to-sprint.tsx"),
                    // route("sprint/:sprintId/board", "routes/scrum/project/by-id/sprint/sprint-board.tsx"),
                    route("board", "routes/scrum/project/by-id/board-redirect.tsx"),
                    
                    layout("layouts/board-layout.tsx", [
                    ...prefix("board/:sprintId", [
                            index("routes/scrum/project/by-id/sprint/sprint-board.tsx"),
                            route("move-item-in-column/:itemId/:newPosition", "routes/scrum/project/by-id/sprint/board/move-item-in-column.tsx"),
                            route("move-item-between-columns/:itemId/:targetColumnId/:targetPosition", "routes/scrum/project/by-id/sprint/board/move-item-between-columns.tsx"),
                            route("move-column/:columnId/:newPosition", "routes/scrum/project/by-id/sprint/board/move-column.tsx"),
                            route("create-column", "routes/scrum/project/by-id/sprint/board/create-column.tsx"),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]),
    route("action/set-theme", "routes/action/set-theme.ts"),
] satisfies RouteConfig;
