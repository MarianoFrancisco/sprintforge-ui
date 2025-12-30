import { Link, redirect, type LoaderFunctionArgs } from "react-router";
import { Welcome } from "../welcome/welcome";
import { getAuthSession } from "~/sessions.server";
import { Button } from "~/components/ui/button";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getAuthSession(request);

  const userId = session.get("userId");
  const employeeId = session.get("employeeId");

  if (userId && employeeId) {
    return redirect("/dashboard");
  }

  return {userId};
}

export default function Home() {
  return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <Welcome />
        </div>
      </div>
  )
}
