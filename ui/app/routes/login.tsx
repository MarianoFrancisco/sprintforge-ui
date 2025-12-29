import { LoginForm } from "~/components/login-form"
import type { Route } from "./+types/login";
import { redirect, useActionData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { authService } from "~/services/identity/auth-service";
import { commitAuthSession, getAuthSession } from "~/sessions.server";
import { ApiError } from "~/lib/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const {userId, authSessionId, employeeId} = await authService.login(email, password);

    const session = await getAuthSession(request);
    session.set("userId", userId);
    session.set("authSessionId", authSessionId);
    session.set("employeeId", employeeId);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    });
  } catch (error: any) {
    console.log("error en action create position", error);
    if (error instanceof ApiError && error.response) {
      try {
        const errorData = (error.response as any).data || error.response;

        return {
          errors: errorData.errors || {},
          error: errorData.detail || errorData.message || `Error ${error.status}`,
        };
      } catch (parseError) {
        return { error: `Error ${error.status}: No se pudo procesar la respuesta` };
      }
    }

    return { error: error.message || "Error al iniciar sesion" };
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getAuthSession(request);

  const userId = session.get("userId");
  const employeeId = session.get("employeeId");

  if (userId && employeeId) {
    return redirect("/dashboard");
  }

  return null;
}


export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
