import {
  Button,
  Flex,
  Heading,
  Input,
  Spacer,
  Stack,
  StackDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  createUser,
  deleteUser,
  editUser,
  getAll as getAllUsers,
} from "../../services/user.service";
import { useEffect, useState } from "react";
import { CustomDrawer } from "../../components/common/custom-drawer/custom-drawer";
import { IUser } from "../../types/user";
import { UserTable } from "../../components/user/user-table";
import { Select } from "chakra-react-select";
import { IRole } from "../../types/role";
import { getAllRoles } from "../../services/role.service";

export const User = () => {
  const toast = useToast();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllRoles()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: IRole[]) => {
              setRoles(data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter as permissões de usuário.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          console.log("else");
          toast({
            title: "Não foi possível obter as permissões de usuário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter as permissões de usuário.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  useEffect(() => {
    if (isOpen || loading) {
      return;
    }

    getAllUsers()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: IUser[]) => {
              setUsers(data);
            })
            .catch(() => {
              console.log("deserialize");
              toast({
                title: "Não foi possível obter os usuários.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          console.log("else");
          toast({
            title: "Não foi possível obter os usuários.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter os usuários.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [isOpen, loading]);

  const handleOnSave = () => {
    createUser(username, password, selectedRoles)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          toast({
            title: "Usuário cadastrado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen(false);
        } else {
          toast({
            title: "Não foi possível cadastrar o usuário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao cadastrar usuário.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleOnDelete = (id: string) => {
    setLoading(true);
    deleteUser(id)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          toast({
            title: "Usuário exluído com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Não foi possível excluir usuário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao excluir usuário.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnEdit = (user: IUser) => {
    setLoading(true);
    editUser(user)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          toast({
            title: "Usuário editado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen(false);
        } else {
          toast({
            title: "Não foi possível editar usuário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao editar usuário.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(true);
      });
  };

  return (
    <>
      <VStack spacing={2} divider={<StackDivider />}>
        <Flex w={"100vw"} p={4}>
          <Heading>Usuários</Heading>
          <Spacer />
          <Button onClick={() => setIsOpen(true)}>Novo</Button>
        </Flex>
        <UserTable
          users={users}
          loading={loading}
          onClickDelete={handleOnDelete}
          onClickEdit={handleOnEdit}
        />
      </VStack>
      <CustomDrawer isOpen={isOpen} setIsOpen={setIsOpen} onSave={handleOnSave}>
        <Stack spacing={4}>
          <Input
            required
            type="email"
            placeholder="Informe o email"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            required
            type="password"
            placeholder="Informe a senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select
            required
            placeholder="Selecione as permissões do usuário"
            isMulti
            onChange={(selectedRoles) =>
              setSelectedRoles(selectedRoles.map((m) => m.value))
            }
            options={roles.map((m) => ({
              label: m.name,
              value: m.id,
            }))}
          />
        </Stack>
      </CustomDrawer>
    </>
  );
};
