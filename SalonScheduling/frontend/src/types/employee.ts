import { IContact } from "./contact";

export interface IWorkShift {
  startTime: string;
  endTime: string;
}

export interface IEmployee {
  id: string;
  name: string;
  contact: IContact;
  salonServices: string[];
  availability: Record<string, IWorkShift[]>;
}

export interface ICreateEmployee {
  name: string;
  contact: IContact;
  createUser: boolean;
  userPassword?: string;
  userRoles?: string[];
  salonServicesIds?: string[];
  availability?: Record<string, IWorkShift[]>;
}

export interface IUpdateEmployee {
  id: string;
  name: string;
  contact: IContact;
  salonServicesIds: string[];
  availability?: Record<string, IWorkShift[]>;
}

export interface IEmployeeState {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeePhoneNumber: string;
  password: string;
  selectedRoles: string[];
  salonServices: string[];
  selectedSalonServices: string[];
  availability?: Record<string, IWorkShift[]>;
}
