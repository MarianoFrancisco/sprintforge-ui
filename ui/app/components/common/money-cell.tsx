import { formatGTQ } from "~/util/currency-formatter"

export function MoneyCell({ value, className }: { value?: number | null, className?: string }) {
  return (
    <span className={`font-mono text-sm ${className ?? ""}`}>
      {formatGTQ(value? value : 0)}
    </span>
  )
}