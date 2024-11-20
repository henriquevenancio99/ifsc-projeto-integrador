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
  createClient,
  deleteClient,
  editClient,
  getAllClients,
} from "../../services/client.service";

import { useEffect, useState } from "react";
import { IClient, IClientState } from "../../types/client";
import { MdAdd } from "react-icons/md";
import { DeleteAlert } from "../../components/common/delete-alert";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { CustomModal } from "../../components/common/custom-modal";
import IErrorResponse from "../../types/error-response";
import { getErrorMessages } from "../../utils/error-response";
import { RenderWithLoading } from "../../components/common/render-with-loading";
import { ClientDrawer } from "../../components/client/client-drawer";

const Client = () => {
  const toast = useToast();
  const [clients, setClients] = useState<IClient[]>([]);
  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    clientSaveDrawer: false,
    clientEditDrawer: false,
    clientDeleteAlert: false,
    clientShowModal: false,
  });

  const [clientState, setClientState] = useState<IClientState>({
    clientId: "",
    clientName: "",
    clientEmail: "",
    clientPhoneNumber: "",
  });

  const updateClientState = (field: keyof IClientState, value: any) => {
    setClientState((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      isOpen["clientSaveDrawer"] ||
      isOpen["clientEditDrawer"] ||
      isOpen["clientDeleteAlert"] ||
      isOpen["clientShowModal"]
    ) {
      return;
    }

    updateClientState("clientId", "");
    updateClientState("clientName", "");
    updateClientState("clientEmail", "");
    updateClientState("clientPhoneNumber", "");

    setLoading(true);

    getAllClients()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: IClient[]) => {
              setClients(data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter os clientes.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Não foi possível obter os clientes.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter os clientes.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  const handleOnShow = (client: IClient) => {
    updateClientState("clientId", client?.id);
    updateClientState("clientName", client?.name);
    updateClientState("clientEmail", client?.contact.email);
    updateClientState("clientPhoneNumber", client?.contact.phoneNumber);

    setIsOpen((prevData) => ({
      ...prevData,
      ["clientShowModal"]: true,
    }));
  };

  const handleOnSave = () => {
    createClient({
      name: clientState.clientName,
      contact: {
        email: clientState.clientEmail,
        phoneNumber: clientState.clientPhoneNumber,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Cliente cadastrado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["clientSaveDrawer"]: false,
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
              title: "Não foi possível cadastrar o cliente.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "Não foi possível cadastrar o cliente.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao cadastrar cliente.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleConfirmDelete = () => {
    setLoading(true);

    deleteClient(clientState.clientId)
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Cliente exluído com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível excluir o cliente.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "Não foi possível excluir cliente.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao excluir cliente.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsOpen((prevData) => ({
          ...prevData,
          ["clientDeleteAlert"]: false,
        }));

        setLoading(false);
      });
  };

  const handleOnDelete = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["clientShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["clientDeleteAlert"]: true,
    }));
  };

  const handleOnEdit = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["clientShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["clientEditDrawer"]: true,
    }));
  };

  const handleOnSaveEdit = () => {
    setLoading(true);

    editClient({
      id: clientState.clientId,
      name: clientState.clientName,
      contact: {
        email: clientState.clientEmail,
        phoneNumber: clientState.clientPhoneNumber,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Cliente editado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["clientEditDrawer"]: false,
          }));
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível editar o cliente.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "Não foi possível editar cliente.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao editar cliente.",
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
        <Heading>Clientes</Heading>
        <Button
          leftIcon={<MdAdd size={"2rem"} />}
          onClick={() =>
            setIsOpen((prevData) => ({
              ...prevData,
              ["clientSaveDrawer"]: true,
            }))
          }
        >
          Novo
        </Button>
      </HStack>
      <Divider mt={2} mb={2} />
      <RenderWithLoading loading={loading}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
          {clients.map((m) => (
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
                      {m.name}
                    </Heading>
                  </HStack>
                </CardHeader>
              </Card>
            </Button>
          ))}
        </SimpleGrid>
      </RenderWithLoading>
      <ClientDrawer
        isOpen={isOpen["clientSaveDrawer"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["clientSaveDrawer"]: isOpen,
          }))
        }
        updateClientState={updateClientState}
        handleOnSave={handleOnSave}
      />
      <ClientDrawer
        isEdit
        isOpen={isOpen["clientEditDrawer"]}
        clientName={clientState.clientName}
        clientEmail={clientState.clientEmail}
        clientPhoneNumber={clientState.clientPhoneNumber}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["clientEditDrawer"]: isOpen,
          }))
        }
        updateClientState={updateClientState}
        handleOnSave={handleOnSaveEdit}
      />
      <DeleteAlert
        handleOnDelete={handleConfirmDelete}
        isOpen={isOpen["clientDeleteAlert"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["clientDeleteAlert"]: isOpen,
          }))
        }
      />
      <CustomModal
        header="Detalhes"
        isOpen={isOpen["clientShowModal"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["clientShowModal"]: isOpen,
          }))
        }
      >
        <Stack>
          <HStack>
            <Heading size={"sm"}>Nome:</Heading>
            <Text>{clientState.clientName}</Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Email:</Heading>
            <Text isTruncated>{clientState.clientEmail}</Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Celular:</Heading>
            <Text>{clientState.clientPhoneNumber}</Text>
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

export default Client;
