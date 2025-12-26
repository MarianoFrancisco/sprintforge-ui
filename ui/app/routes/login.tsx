import { LoginForm } from "~/components/login-form"
import type { Route } from "./+types/login";
import { redirect, useActionData, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { authService } from "~/services/identity/auth-service";
import { commitSession, getSession } from "~/sessions.server";
import { ApiError } from "~/lib/public-api";
import { useEffect } from "react";
import { toast } from "sonner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Login" },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const {userId, authSessionId} = await authService.login(email, password);

    const session = await getSession();
    session.set("userId", userId);
    session.set("authSessionId", authSessionId);

    const user = await authService.getCurrentUser(userId);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
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
  const session = await getSession(request.headers.get("Cookie"));

  if (session.get("userId")) {
    throw redirect("/");
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
  );
}
