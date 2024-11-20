import { IContact } from "./contact";

export interface IClient {
  id: string;
  name: string;
  contact: IContact;
}

export interface ICreateClient {
  name: string;
  contact: IContact;
}

export interface IClientState {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhoneNumber: string;
}
