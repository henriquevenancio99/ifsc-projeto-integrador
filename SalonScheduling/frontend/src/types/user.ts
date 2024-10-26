export interface IUser {
  id: string;
  username: string;
  roles: string[];
}

export interface IEditUser extends IUser {
  password: string;
}