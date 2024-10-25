// import { useNavigate } from "react-router-dom";

import { IToken } from "../types/token";
import { BASE_URL } from "./config";

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  const token = localStorage.getItem("token");

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const refreshResponse = await fetch(`${BASE_URL}/users:refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: localStorage.getItem("username"),
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });

    if (refreshResponse.ok) {
      const tokenResponse: IToken = await refreshResponse.json();
      localStorage.setItem("username", tokenResponse.username);
      localStorage.setItem("token", tokenResponse.token);
      localStorage.setItem("refreshToken", tokenResponse.refreshToken);

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${tokenResponse.token}`,
      };

      response = await fetch(`${BASE_URL}${endpoint}`, options);
    }
  }

  return response;
};
