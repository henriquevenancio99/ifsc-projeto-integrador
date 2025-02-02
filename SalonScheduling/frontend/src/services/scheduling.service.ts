import { IScheduling } from "../types/scheduling";
import { fetchWithAuth } from "./auth.service";

export const getAllSchedulings = (): Promise<Response> => {
  return fetchWithAuth("/schedulings", {
    method: "GET",
  });
};

export const createScheduling = (
  createScheduling: IScheduling
): Promise<Response> => {
  return fetchWithAuth("/schedulings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createScheduling),
  });
};

export const deleteScheduling = (id: string): Promise<Response> => {
  return fetchWithAuth(`/schedulings/${id}`, {
    method: "DELETE",
  });
};

export const editScheduling = (scheduling: IScheduling): Promise<Response> => {
  return fetchWithAuth(`/schedulings/${scheduling.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheduling),
  });
};
