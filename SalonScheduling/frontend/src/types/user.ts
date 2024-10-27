export interface IUser {
  id: string;
  username: string;
  roles: string[];
}

export interface IEditUser extends IUser {
  password: string;
}

export interface IUserState {
  userId: string;
  username: string;
  password: string;
  selectedRoles: string[];
}
