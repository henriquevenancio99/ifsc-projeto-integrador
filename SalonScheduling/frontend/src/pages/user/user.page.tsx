import {
  Button,
  Flex,
  Heading,
  Spacer,
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
import { IUser, IUserState } from "../../types/user";
import { UserTable } from "../../components/user/user-table";
import { UserDrawer } from "../../components/user/user-drawer";
import { MdAdd } from "react-icons/md";
import { DeleteAlert } from "../../components/common/delete-alert/delete-alert";

export const User = () => {
  const toast = useToast();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    userSaveDrawer: false,
    userEditDrawer: false,
    userDeleteAlert: false,
  });

  const [userState, setUserState] = useState<IUserState>({
    userId: "",
    username: "",
    password: "",
    selectedRoles: [],
  });

  const updateUserState = (field: keyof IUserState, value: any) => {
    setUserState((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      isOpen["userSaveDrawer"] ||
      isOpen["userEditDrawer"] ||
      isOpen["userDeleteAlert"] ||
      loading
    ) {
      return;
    }

    updateUserState("userId", "");
    updateUserState("username", "");
    updateUserState("password", "");
    updateUserState("selectedRoles", []);

    getAllUsers()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: IUser[]) => {
              setUsers(data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter os usuários.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
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
    createUser(userState.username, userState.password, userState.selectedRoles)
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Usuário cadastrado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["userSaveDrawer"]: false,
          }));
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

  const handleConfirmDelete = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["userDeleteAlert"]: false,
    }));

    setLoading(true);
    deleteUser(userState.userId)
      .then((response) => {
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

  const handleOnDelete = (user: IUser) => {
    updateUserState("userId", user.id);
    setIsOpen((prevData) => ({
      ...prevData,
      ["userDeleteAlert"]: true,
    }));
  };

  const handleOnEdit = (user: IUser) => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["userEditDrawer"]: true,
    }));

    updateUserState("userId", user.id);
    updateUserState("username", user.username);
    updateUserState("selectedRoles", user.roles);
  };

  const handleOnSaveEdit = () => {
    setLoading(true);

    editUser({
      id: userState.userId,
      username: userState.username,
      password: userState.password,
      roles: userState.selectedRoles,
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Usuário editado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["userEditDrawer"]: false,
          }));
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
        setLoading(false);
      });
  };

  return (
    <>
      <DeleteAlert
        handleOnDelete={handleConfirmDelete}
        isOpen={isOpen["userDeleteAlert"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["userDeleteAlert"]: isOpen,
          }))
        }
      />
      <VStack spacing={2} divider={<StackDivider />}>
        <Flex w={"100vw"} p={4}>
          <Heading>Usuários</Heading>
          <Spacer />
          <Button
            leftIcon={<MdAdd size={"2rem"} />}
            onClick={() =>
              setIsOpen((prevData) => ({
                ...prevData,
                ["userSaveDrawer"]: true,
              }))
            }
          >
            Novo
          </Button>
        </Flex>
        <UserTable
          users={users}
          loading={loading}
          currentPage={1}
          pageSize={10}
          totalPages={1}
          onPageChange={() => console.log("MUDOU DE PAGINA")}
          onClickDelete={handleOnDelete}
          onClickEdit={handleOnEdit}
        />
      </VStack>
      <UserDrawer
        isOpen={isOpen["userSaveDrawer"]}
        selectedRoles={userState.selectedRoles}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["userSaveDrawer"]: isOpen,
          }))
        }
        updateUserState={updateUserState}
        handleOnSave={handleOnSave}
      />
      <UserDrawer
        isEdit
        isOpen={isOpen["userEditDrawer"]}
        username={userState.username}
        selectedRoles={userState.selectedRoles}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["userEditDrawer"]: isOpen,
          }))
        }
        updateUserState={updateUserState}
        handleOnSave={handleOnSaveEdit}
      />
    </>
  );
};
