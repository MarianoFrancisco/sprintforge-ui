import { useProject } from "~/hooks/use-project";

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