// ~/routes/scrum/board-columns/create-board-column.tsx
import { useState } from "react"
import {
  type ActionFunctionArgs,
  data,
  redirect,
  useNavigate,
} from "react-router"

import { requireIdentity } from "~/auth.server"
import { commitAuthSession, getAuthSession } from "~/sessions.server"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

// Ajusta este import al path real de tu servicio
import { boardColumnService } from "~/services/scrum/board-column-service"
import { BoardColumnForm } from "~/components/scrum/sprint/board-column-form"

export function meta() {
  return [{ title: "Crear columna" }]
}

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await getAuthSession(request)
  const sprintId = params.sprintId;

  if (!sprintId) {
    throw redirect("/")
  }

  const { employeeId } = await requireIdentity(request, {
    redirectTo: "/",
    flashMessage: "Debes iniciar sesión para realizar esta acción.",
  })

  const formData = await request.formData()
  let errors: Record<string, string> = {}

  try {
    const name = String(formData.get("name") ?? "").trim()

    await boardColumnService.create({
      employeeId,
      sprintId,
      name,
    })

    session.flash("success", "Columna creada correctamente")
  } catch (error: any) {
    console.error("error en action create board column", error)
    session.flash("error", error?.response?.detail || "Error al crear la columna.")
    errors = error?.response?.errors || {}
  }

  return data(
    { errors },
    {
      headers: {
        "Set-Cookie": await commitAuthSession(session),
      },
    },
  )
}

export default function CreateBoardColumnRoute() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(true)

  function onClose() {
    try {
      navigate(-1)
    } catch {
      navigate("/")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onClose()
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crear columna</DialogTitle>
        </DialogHeader>

        {/* Form con default */}
        <BoardColumnForm defaultName="" />
      </DialogContent>
    </Dialog>
  )
}
