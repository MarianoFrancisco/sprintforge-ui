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
import { Form, Link, useNavigation } from "react-router"
import React from "react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form method="post" className="p-6 md:p-8">
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
                  name="email"
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
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                  />

                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                    </>
                  ) : (
                    <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar sesión
                    </>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </Form>
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
    </div>
  )
}
