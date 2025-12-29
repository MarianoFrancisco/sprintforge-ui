export interface GetAllPaymentsQuery {
  employee?: string;
  position?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PayEmployeeRequestDTO {
  date: string;
  bonus?: number;
  deduction?: number;
  notes?: string;
}

export interface PaymentResponseDTO {
  cui: string;
  fullName: string;
  positionId: string;
  positionName: string;
  date: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  total: number;
  notes?: string;
}
