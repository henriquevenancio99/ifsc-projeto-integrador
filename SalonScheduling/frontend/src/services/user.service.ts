import { IUser } from "../types/user";
import { BASE_URL } from "../utils/config";

export const login = async (
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
  const localToken = localStorage.getItem("token");
  const token = `Bearer ${localToken}`;
  return fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
};

export const createUser = async (
  username: string,
  password: string,
  roles: string[]
): Promise<Response> => {
  const localToken = localStorage.getItem("token");
  const token = `Bearer ${localToken}`;
  return fetch(`${BASE_URL}/users:register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      username,
      password,
      roles,
    }),
  });
};

export const deleteUser = async (id: string): Promise<Response> => {
  const localToken = localStorage.getItem("token");
  const token = `Bearer ${localToken}`;
  return fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });
};

export const editUser = async (user: IUser): Promise<Response> => {
  const localToken = localStorage.getItem("token");
  const token = `Bearer ${localToken}`;
  return fetch(`${BASE_URL}/users/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(user),
  });
};
