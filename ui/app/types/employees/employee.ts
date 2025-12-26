export type EmployeeWorkloadType = 'FULL_TIME' | 'PART_TIME';
export type EmployeeStatus = 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

export interface EmployeePosition {
  id: string;
  name: string;
  description: string;
}

export interface EmployeeResponseDTO {
  id: string;
  cui: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
  birthDate: string;
  workloadType: EmployeeWorkloadType;
  salary: number;
  profileImage?: string | null;
  status: EmployeeStatus;
  position: EmployeePosition;
}

export interface HireEmployeeRequest {
  cui: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: string;
  positionId: string;
  workloadType: EmployeeWorkloadType;
  salary: number;
  
  startDate: string;
  profileImage?: File | null;
  notes?: string;
}

export interface UpdateEmployeeDetailRequest {
  firstName?: string;
  lastName?: string;

  phoneNumber?: string;
  birthDate?: string;

  profileImage?: File | null;
}

export interface FindEmployeesRequest {
  searchTerm?: string;
  position?: string;
  workloadType?: EmployeeWorkloadType;
  status?: EmployeeStatus;
}

export interface IncreaseEmployeeSalaryRequest {
  increaseAmount: number;
  date: string;
  notes?: string;
}

export interface ReinstateEmployeeRequest {
  date: string;
  notes?: string;
}

export interface SuspendEmployeeRequest {
  date: string;
  notes?: string;
}

export interface TerminateEmployeeRequest {
  date: string;
  notes?: string;
}