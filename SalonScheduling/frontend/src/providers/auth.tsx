import { createContext, useContext, useMemo, useState } from "react";
import { login as requestLogin } from "../services/user.service";
import { useToast } from "@chakra-ui/react";

interface IProps {
  children: React.ReactElement;
}

interface IAuthContext {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  login: () => Promise.resolve(),
  logout: () => {},
});

export const AuthProvider = ({ children }: IProps) => {
  const localToken = localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(localToken);
  const toast = useToast();

  const login = async (username: string, password: string): Promise<void> => {
    await requestLogin(username, password)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);

            toast({
              title: "Login realizado com sucesso.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            setToken(data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);
          });
        } else if (response.status == 401 || response.status === 403) {
          toast({
            title: "Erro ao realizar o login.",
            description: "Usuário ou senha inválido",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else {
          response.json().then((data) => {
            const errors = Object.values(data.errors).join(", ");

            toast({
              title: "Erro ao realizar o login.",
              description:
                errors || "Verifique suas credenciais e tente novamente",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
        }
      })
      .catch((error) => {
        console.log("catch: ", error);

        toast({
          title: "Erro de conexão.",
          description:
            "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const logout = () => {
    setToken(null);
  };

  const isAuthenticated = !!token;
  console.log("isAuthenticated: ", isAuthenticated);
  console.log("token: ", token);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
