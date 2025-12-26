export type EmploymentHistoryType = 'HIRING' | 'SALARY_INCREASE' | 'SUSPENSION' | 'REINSTATEMENT' | 'TERMINATION';

export interface EmploymentHistoryResponseDTO {
  id: string;
  employeeCui: string;
  employeeFullname: string;
  positionId: string;
  positionName: string;
  type: EmploymentHistoryType;
  startDate: string;
  endDate: string;
  salary: string;
  notes: string;
}

export interface GetAllEmploymentHistoriesQuery {
  employee?: string;
  position?: string;
  type?: EmploymentHistoryType;
  startDateFrom?: string;
  startDateTo?: string;
}