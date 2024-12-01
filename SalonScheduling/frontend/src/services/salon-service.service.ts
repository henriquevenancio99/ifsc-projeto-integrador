import { ICreateSalonService, ISalonService } from "../types/salon-service";
import { fetchWithAuth } from "./auth.service";

export const getAllSalonServices = (): Promise<Response> => {
  return fetchWithAuth("/salonservices", {
    method: "GET",
  });
};

export const getAllSalonServiceTypes = (): Promise<Response> => {
  return fetchWithAuth("/salonservices/types", {
    method: "GET",
  });
};

export const createSalonService = (
  createSalonService: ICreateSalonService
): Promise<Response> => {
  return fetchWithAuth("/salonservices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(createSalonService),
  });
};

export const deleteSalonService = (id: string): Promise<Response> => {
  return fetchWithAuth(`/salonservices/${id}`, {
    method: "DELETE",
  });
};

export const editSalonService = (
  salonservice: ISalonService
): Promise<Response> => {
  return fetchWithAuth(`/salonservices/${salonservice.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(salonservice),
  });
};
