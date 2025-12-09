import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
  ];
}

export default function Page() {
  return (
<p>
  Hla mundo
</p>
  )
}
