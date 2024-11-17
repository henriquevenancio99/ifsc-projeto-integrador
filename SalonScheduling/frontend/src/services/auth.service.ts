import { IToken } from "../types/token";
import { BASE_URL } from "../utils/config";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const persistTokens = (token: IToken) => {
  localStorage.setItem("username", token.username);
  localStorage.setItem("token", token.token);
  localStorage.setItem("refreshToken", token.refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit
): Promise<Response> => {
  let token = localStorage.getItem("token");

  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    token = await refreshToken();

    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      response = await fetch(`${BASE_URL}${endpoint}`, options);
    }
  }

  return response;
};

export const refreshToken = async () => {
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

    persistTokens(tokenResponse);

    return tokenResponse.token;
  }

  return "";
};

export const getUsername = () => localStorage.getItem("username");
