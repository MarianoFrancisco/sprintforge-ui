
export type EmployeeWorkloadType = "FULL_TIME" | "PART_TIME" | "TEMPORARY";

export interface EmployeePosition {
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

  positionId: string;
  workloadType: EmployeeWorkloadType;

  salary: string;
  igssPercentage: string;
  irtraPercentage: string;

  profileImage?: string | null;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;

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

  salary: string;
  igssPercentage: string;
  irtraPercentage: string;

  profileImage?: File | null;

  startDate: string;
  notes?: string;
}

export interface UpdateEmployeeDetailRequest {
  firstName: string;
  lastName: string;

  phoneNumber: string;
  birthDate: string;

  positionId: string;

  igssPercentage: string;
  irtraPercentage: string;

  profileImage?: File | null;
}

export interface FindEmployeesRequest {
  searchTerm?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}
