import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { commitAuthSession, getAuthSession, themeSessionResolver } from "./sessions.server";
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes";
import { Toaster } from "./components/ui/sonner";
import { ErrorPage } from "./routes/error";
import { useEffect } from "react";
import { toast } from "sonner";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // Favicons
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "icon", href: "/favicon.ico" },
];

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Sprint Forge" },
    { name: "description", content: "Bienvenido a Sprint Forge" },
  ];
}


// Return the theme from the session storage using the loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  const session = await getAuthSession(request);
  return data({
    theme: getTheme(),
    error: session.get("error"),
    success: session.get("success"),
  }, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}


function App() {
  const data = useLoaderData();
  const [theme] = useTheme();

  return (
    <html lang="en" data-theme={theme ?? ""} className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
       <body >
        <Outlet />
        <Toaster
          position="top-center"
          richColors={true}
          closeButton={true}
          swipeDirections={["left", "right"]}
        />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    if (data.error) {
      toast.error(data.error);
    }
    if (data.success) {
      toast.success(data.success);
    }
  }, [data.error, data.success]);
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme" disableTransitionOnThemeChange={true}>
      <App />
    </ThemeProvider>
  )
}

// TODO fix the theme loading in error boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let data: any = {};
  try {
    data = useLoaderData();
  } catch {
    data = { theme: "light" }; // fallback seguro
  }

  const theme = data?.theme ?? "light"; // fallback obligatorio

  let title = "Algo salió mal";
  let message = "Ocurrió un error inesperado.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Página no encontrada";
      message = "No pudimos encontrar la página que buscas.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    title = "Error en la aplicación";
    message = error.message;
  }

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <Meta />
        <Links />
      </head>

      <body>
        <ErrorPage title={title} message={message} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

