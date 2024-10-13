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
      username: username,
      password: password,
    }),
  });
};
