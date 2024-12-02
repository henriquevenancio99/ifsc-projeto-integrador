import { IContact } from "./contact";

export interface IEmployee {
  id: string;
  name: string;
  contact: IContact;
  salonServices: string[];
}

export interface ICreateEmployee {
  name: string;
  contact: IContact;
  createUser: boolean;
  userPassword?: string;
  userRoles?: string[];
  salonServicesIds?: string[];
}

export interface IUpdateEmployee {
  id: string;
  name: string;
  contact: IContact;
  salonServicesIds: string[];
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
}
