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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    await login(email, password);

    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated]);

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
