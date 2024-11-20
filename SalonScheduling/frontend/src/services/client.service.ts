import { ICreateClient, IClient } from "../types/client";
import { fetchWithAuth } from "./auth.service";

export const getAllClients = (): Promise<Response> => {
  return fetchWithAuth("/clients", {
    method: "GET",
  });
};

export const createClient = (
  createClient: ICreateClient
): Promise<Response> => {
  return fetchWithAuth("/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createClient),
  });
};

export const deleteClient = (id: string): Promise<Response> => {
  return fetchWithAuth(`/clients/${id}`, {
    method: "DELETE",
  });
};

export const editClient = (client: IClient): Promise<Response> => {
  return fetchWithAuth(`/clients/${client.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });
};
