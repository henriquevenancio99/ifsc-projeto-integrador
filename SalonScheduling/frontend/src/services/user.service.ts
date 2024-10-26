import { IEditUser } from "../types/user";
import { fetchWithAuth } from "./auth.service";
import { BASE_URL } from "../utils/config";

export const login = (
  username: string,
  password: string
): Promise<Response> => {
  return fetch(`${BASE_URL}/users:login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
};

export const getAll = (): Promise<Response> => {
  return fetchWithAuth("/users", {
    method: "GET",
  });
};

export const createUser = (
  username: string,
  password: string,
  roles: string[]
): Promise<Response> => {
  return fetchWithAuth("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      roles,
    }),
  });
};

export const deleteUser = (id: string): Promise<Response> => {
  return fetchWithAuth(`/users/${id}`, {
    method: "DELETE",
  });
};

export const editUser = (user: IEditUser): Promise<Response> => {
  return fetchWithAuth(`/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
};
