import type { Route } from "./+types/set-initial-password";
import { data, redirect, useActionData, useNavigate, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { authService } from "~/services/identity/auth-service";
import { getAuthSession } from "~/sessions.server";
import { error } from "console";
import { SetPasswordForm } from "~/components/identity/set-password-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contraseña inicial" },
  ];
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = params.userId;

  if (!userId) {
    throw error("User ID is required");
  }

  try {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword)
        return data({success:undefined, error: "Las contraseñas no coinciden."});
    await authService.setInitialPassword(userId, password);

    return data({success: "Contraseña establecida correctamente. Ya puedes iniciar sesión.", error: null});
  } catch (error: any) {
    console.log("error en action set initial password", error);
    return data({success: undefined, error: error?.response?.detail || "Error al establecer la contraseña."});
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


export default function InitialPasswordPage() {
      const actionData = useActionData<typeof action>();
      const navigate = useNavigate();
      useEffect(() => {
        if (actionData?.error) {
          toast.error(actionData.error);
        }
        if (actionData?.success) {
          toast.success(actionData.success);
          navigate("/login");
        }
      }, [actionData]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SetPasswordForm />
      </div>
    </div>
  )
}
