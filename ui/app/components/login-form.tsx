import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { ModeToggle } from "./ui/mode-toggle"
import { Link } from "react-router"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <ModeToggle />
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bienvenido</h1>
                <p className="text-muted-foreground text-balance">
                  Inicia sesión en tu cuenta de Sprint Forge
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Link
                    to="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>
                <Button type="submit">Iniciar Sesión</Button>
              </Field>
              {/* <FieldDescription className="text-center">
                Sin cuenta? <Link to="#">Crear cuenta</Link>
              </FieldDescription> */}
            </FieldGroup>
          </form>
          <div className="relative hidden md:block bg-muted">
            {/* Imagen normal */}
            <img
              src="/mountains.jpg"
              alt="Background"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Capa enmascarada con el logo y efecto naranja */}
            <div
              className="
      absolute inset-0 h-full w-full 
      mask-[url('/logo.svg')] mask-no-repeat mask-center mask-contain
      bg-[url('/mountains.jpg')] bg-cover bg-center
      mix-blend-multiply
    "
            />
          </div>




        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  )
}
