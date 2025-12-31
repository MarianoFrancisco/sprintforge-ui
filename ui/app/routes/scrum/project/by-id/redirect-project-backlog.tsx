import { redirect, type LoaderFunctionArgs } from "react-router";

export function meta() {
  return [
    { title: "Backlog" },
    { name: "description", content: "Backlog del proyecto" },
  ]
}

export async function loader({params}: LoaderFunctionArgs) {
  console.log("Redirecting to project backlog...");
  return redirect(`/projects/${params.projectId}/sprints`);
}

export default function RedirectProjectBacklogRoute() {
  return null;
}
