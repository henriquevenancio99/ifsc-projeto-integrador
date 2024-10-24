import { BASE_URL } from "../utils/config";

export const getAllRoles = (): Promise<Response> => {
  const localToken = localStorage.getItem("token");
  const token = `Bearer ${localToken}`;
  return fetch(`${BASE_URL}/roles`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
};
