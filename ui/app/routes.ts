import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    layout("layouts/sidebar-layout.tsx", [
        route("dashboard", "routes/dashboard.tsx"),
    ]

    ),
    route("action/set-theme", "routes/action/set-theme.ts"),
] satisfies RouteConfig;
