import { useUser } from "~/hooks/use-user";
import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
  ];
}

export default function DashboardPage() {
  const {user} = useUser();
  return <p>Hola {user.fullname}</p>;
}

