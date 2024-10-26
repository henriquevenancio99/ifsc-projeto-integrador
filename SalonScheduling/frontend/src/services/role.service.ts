import { fetchWithAuth } from "./auth.service";

export const getAllRoles = (): Promise<Response> => {
  return fetchWithAuth("/roles", {
    method: "GET",
  });
};
