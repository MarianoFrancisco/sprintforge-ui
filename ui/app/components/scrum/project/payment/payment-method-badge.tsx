// ~/components/payments/payment-method-badge.tsx
import { Badge } from "~/components/ui/badge"

export type PaymentMethod = "CASH" | "TRANSFER"

interface PaymentMethodBadgeProps {
  method: PaymentMethod
}

function methodLabel(method: PaymentMethod): string {
  switch (method) {
    case "CASH":
      return "Efectivo"
    case "TRANSFER":
      return "Transferencia"
    default:
      return method
  }
}

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  return (
    <Badge variant="secondary">
      {methodLabel(method)}
    </Badge>
  )
}
