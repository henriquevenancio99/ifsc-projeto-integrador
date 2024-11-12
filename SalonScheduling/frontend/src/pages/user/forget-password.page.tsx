import React, { useState } from "react";
import { forgetPassword } from "../../services/user.service";
import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    forgetPassword(email)
      .then((response) => {
        if (response.ok) {
          toast({
            title:
              "O link para resetar sua senha foi enviado para o seu e-mail.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setEmail("");
        } else {
          response.json().then((data) => {
            const errors = Object.values(data.errors).join(", ");

            toast({
              title: "Erro ao solicitar recuperação de conte.",
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
      <Heading>Recuperação de conta</Heading>
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
        <Button isLoading={loading} type="submit" width="full">
          Recuperar
        </Button>
      </Stack>
    </VStack>
  );
};

export default ForgetPassword;
