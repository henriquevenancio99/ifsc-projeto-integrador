import {
  Button,
  Card,
  CardHeader,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  Stack,
  useToast,
} from "@chakra-ui/react";

import {
  createUser,
  deleteUser,
  editUser,
  getAll as getAllUsers,
} from "../../services/user.service";

import { useEffect, useState } from "react";
import { IUser, IUserState } from "../../types/user";
import { UserDrawer } from "../../components/user/user-drawer";
import { MdAdd } from "react-icons/md";
import { DeleteAlert } from "../../components/common/delete-alert";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { CustomModal } from "../../components/common/custom-modal";
import IErrorResponse from "../../types/error-response";
import { getErrorMessages } from "../../utils/error-response";
import { RenderWithLoading } from "../../components/common/render-with-loading";
import { getUsername, refreshToken } from "../../services/auth.service";

const User = () => {
  const toast = useToast();
  const [users, setUsers] = useState<IUser[]>([]);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    userSaveDrawer: false,
    userEditDrawer: false,
    userDeleteAlert: false,
    userShowModal: false,
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
      isOpen["userShowModal"]
    ) {
      return;
    }

    updateUserState("userId", "");
    updateUserState("username", "");
    updateUserState("password", "");
    updateUserState("selectedRoles", []);

    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  const handleOnShow = (user: IUser) => {
    console.log(user);
    updateUserState("userId", user?.id);
    updateUserState("username", user?.username);
    updateUserState("selectedRoles", user?.roles);

    setIsOpen((prevData) => ({
      ...prevData,
      ["userShowModal"]: true,
    }));
  };

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
        } else if (response.status === 403) {
          toast({
            title: "Você não possui permissão para executar essa ação.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível cadastrar o usuário.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
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
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível excluir o usuário.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
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
        setIsOpen((prevData) => ({
          ...prevData,
          ["userDeleteAlert"]: false,
        }));
        setLoading(false);
      });
  };

  const handleOnDelete = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["userShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["userDeleteAlert"]: true,
    }));
  };

  const handleOnEdit = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["userShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["userEditDrawer"]: true,
    }));
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

          if (getUsername() === userState.username) {
            refreshToken().then((token) => {
              if (token) {
                toast({
                  title: "Suas credenciais foram atualizadas com sucesso.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              } else {
                toast({
                  title: "Não foi possível atualizar suas credenciais.",
                  status: "warning",
                  description: "Recomendamos que faça login novamente.",
                  duration: 3000,
                  isClosable: true,
                });
              }
            });
          }
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível editar o usuário.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
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
      <HStack justifyContent={"space-between"} spacing={2}>
        <Heading>Usuários</Heading>
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
      </HStack>
      <Divider mt={2} mb={2} />
      <RenderWithLoading loading={loading}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
          {users.map((m) => (
            <Button
              key={m.id}
              variant={"outline"}
              boxShadow={"xl"}
              h={"100%"}
              pr={10}
              rightIcon={<BiShow size={"2rem"} />}
              onClick={() => handleOnShow(m)}
            >
              <Card w={"100%"} bg={"transparent"} boxShadow={"none"}>
                <CardHeader>
                  <HStack justifyContent={"space-between"}>
                    <Heading size={"md"} isTruncated>
                      {m.username}
                    </Heading>
                  </HStack>
                </CardHeader>
              </Card>
            </Button>
          ))}
        </SimpleGrid>
      </RenderWithLoading>
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
      <CustomModal
        header="Detalhes"
        isOpen={isOpen["userShowModal"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["userShowModal"]: isOpen,
          }))
        }
      >
        <Stack>
          <HStack>
            <Heading size={"sm"}>Username:</Heading>
            <Text>{userState.username}</Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Permissões:</Heading>
            <Text>{userState.selectedRoles.join(", ")}</Text>
          </HStack>
          <Divider mt={2} mb={2} />
          <HStack justify={"end"}>
            <Button leftIcon={<BiEdit />} onClick={() => handleOnEdit()}>
              Editar
            </Button>
            <Button leftIcon={<BiTrash />} onClick={() => handleOnDelete()}>
              Deletar
            </Button>
          </HStack>
        </Stack>
      </CustomModal>
    </>
  );
};

export default User;
