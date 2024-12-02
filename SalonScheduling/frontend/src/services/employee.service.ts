import { ICreateEmployee, IUpdateEmployee } from "../types/employee";
import { fetchWithAuth } from "./auth.service";

export const getAllEmployees = (): Promise<Response> => {
  return fetchWithAuth("/employees", {
    method: "GET",
  });
};

export const createEmployee = (
  createEmployee: ICreateEmployee
): Promise<Response> => {
  return fetchWithAuth("/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createEmployee),
  });
};

export const deleteEmployee = (id: string): Promise<Response> => {
  return fetchWithAuth(`/employees/${id}`, {
    method: "DELETE",
  });
};

export const editEmployee = (employee: IUpdateEmployee): Promise<Response> => {
  return fetchWithAuth(`/employees/${employee.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
};
