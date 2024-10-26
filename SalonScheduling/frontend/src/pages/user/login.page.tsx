import {
  Box,
  Button,
  FormControl,
  Input,
  Stack,
  Heading,
  FormHelperText,
  Link,
  Flex,
  Avatar,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../services/user.service";
import { persistTokens } from "../../services/auth.service";

export const Login = () => {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    login(email, password)
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            toast({
              title: "Login realizado com sucesso.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            persistTokens(data);

            navigate(location.state?.from?.pathname || "/home", {
              replace: true,
            });
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
    <Flex
      direction="column"
      w="100vw"
      h="100vh"
      justify="center"
      alignItems="center"
    >
      <Avatar />
      <Heading>Login</Heading>
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
            placeholder="Informe seu email"
          />
        </FormControl>
        <FormControl id="password">
          <InputGroup>
            <Input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Informe sua senha"
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
          <FormHelperText textAlign="right">
            <Link>Esqueceu a senha?</Link>
          </FormHelperText>
        </FormControl>
        <Button isLoading={loading} type="submit" width="full">
          Login
        </Button>
      </Stack>
      <Box>
        Não tem conta? <Link href="#">Cadastre-se</Link>
      </Box>
    </Flex>
  );
};
