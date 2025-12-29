import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("logout", "routes/logout.tsx"),
    layout("layouts/sidebar-layout.tsx", [
        route("dashboard", "routes/dashboard.tsx"),

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

            ...prefix(":id", [
                layout("layouts/project-layout.tsx", [
                    index("routes/scrum/project/by-id/project-home.tsx"),
                    // route("add-employees", "routes/scrum/project/by-id/add-employees.tsx"),
                ])
            ]),
        ]),
    ]),
    route("action/set-theme", "routes/action/set-theme.ts"),
] satisfies RouteConfig;
