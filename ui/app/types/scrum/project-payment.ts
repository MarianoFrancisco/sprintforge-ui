import type { ProjectResponseDTO } from "./project"

export type PaymentMethod = "CASH" | "TRANSFER" | "CARD"

export interface GetAllPaymentsQuery {
  searchTerm?: string
  projectId?: string
  method?: string
  fromDate?: string
  toDate?: string
}

export interface CreatePaymentRequestDTO {
  employeeId: string
  projectId: string
  date: string
  amount: string // BigDecimal
  method: PaymentMethod
  reference?: string
  note?: string
}

export interface PaymentResponseDTO {
  id: string
  date: string
  amount: string // BigDecimal
  method: PaymentMethod
  reference?: string
  note?: string
  createdAt: string // Instant ISO datetime
  project: ProjectResponseDTO
}
