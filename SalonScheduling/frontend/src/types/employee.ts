export interface IEmployee {
  id: string;
  name: string;
  contact: IContact;
}

export interface IContact {
  email: string;
  phoneNumber: string;
}

export interface ICreateEmployee {
  name: string;
  contact: IContact;
  createUser: boolean;
  userPassword?: string;
  userRoles?: string[];
}

export interface IEmployeeState {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeePhoneNumber: string;
  password: string;
  selectedRoles: string[];
}
