import React, { useEffect, useState } from "react";
import { resetPassword } from "../../services/user.service";
import {
  Button,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailParam = urlParams.get("email");
    const tokenParam = urlParams.get("token");

    if (emailParam && tokenParam) {
      setEmail(emailParam);
      setToken(decodeURIComponent(tokenParam));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    resetPassword(email, token, newPassword)
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Sua senha foi alterada com sucesso.",
            description: "Faça login novamente para acessar sua conta",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          navigate(location.state?.from?.pathname || "/login", {
            replace: true,
          });
        } else {
          response.json().then((data) => {
            const errors = Object.values(data.errors).join(", ");

            toast({
              title: "Erro ao solicitar alteração da senha.",
              description: errors,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro de conexão.",
          description:
            "Não foi possível conectar ao servidor. Tente novamente mais tarde.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <VStack pt={"10vh"}>
      <Heading>Alterar a senha</Heading>
      <Stack
        onSubmit={handleSubmit}
        as="form"
        spacing={4}
        p="1rem"
        boxShadow="lg"
        margin="1rem"
        minW="30vw"
        borderRadius="md"
      >
        <FormControl id="email">
          <Input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Confirme seu email"
          />
        </FormControl>
        <FormControl id="password">
          <InputGroup>
            <Input
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Informe a sua nova senha"
            />
            <InputRightElement w="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button isLoading={loading} type="submit" width="full">
          Resetar senha
        </Button>
      </Stack>
    </VStack>
  );
};

export default ResetPassword;
