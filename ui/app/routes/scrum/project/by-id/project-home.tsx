import { redirect, type LoaderFunctionArgs } from "react-router";
import { useProject } from "~/hooks/use-project";

// de momento solo redirige al backlog del proyecto
export async function loader({params}: LoaderFunctionArgs) {
  return redirect("/projects/" + params.projectId + "/sprints");
}

export default function ProjectHome() {
  const { project } = useProject();
  return (
    <div>
      <h2 className="text-lg font-semibold">Bienvenido al proyecto</h2>
      <p>Selecciona una pestaña para ver más detalles.</p>
      {project.description}
    </div>
  );
}