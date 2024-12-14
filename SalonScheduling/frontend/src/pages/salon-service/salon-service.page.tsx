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
  createSalonService,
  deleteSalonService,
  editSalonService,
  getAllSalonServices,
} from "../../services/salon-service.service";

import { useEffect, useState } from "react";
import { ISalonService, ISalonServiceState } from "../../types/salon-service";
import { MdAdd } from "react-icons/md";
import { DeleteAlert } from "../../components/common/delete-alert";
import { BiEdit, BiShow, BiTrash } from "react-icons/bi";
import { CustomModal } from "../../components/common/custom-modal";
import IErrorResponse from "../../types/common/error-response";
import { getErrorMessages } from "../../utils/error-response";
import { RenderWithLoading } from "../../components/common/render-with-loading";
import { SalonServiceDrawer } from "../../components/salon-service/salon-service-drawer";

const SalonService = () => {
  const toast = useToast();
  const [salonServices, setSalonServices] = useState<ISalonService[]>([]);
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({
    salonServiceSaveDrawer: false,
    salonServiceEditDrawer: false,
    salonServiceDeleteAlert: false,
    salonServiceShowModal: false,
  });

  const [salonServiceState, setSalonServiceState] =
    useState<ISalonServiceState>({
      salonServiceId: "",
      salonServiceName: "",
      salonServicePrice: 0,
      salonServicePriceFormatted: "R$",
      salonServiceDescription: "",
      salonServiceTypes: {},
      salonServiceTime: "",
      selectedSalonServiceTypes: [],
    });

  const updateSalonServiceState = (
    field: keyof ISalonServiceState,
    value: any
  ) => {
    setSalonServiceState((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      isOpen["salonServiceSaveDrawer"] ||
      isOpen["salonServiceEditDrawer"] ||
      isOpen["salonServiceDeleteAlert"] ||
      isOpen["salonServiceShowModal"]
    ) {
      return;
    }

    updateSalonServiceState("salonServiceId", "");
    updateSalonServiceState("salonServiceName", "");
    updateSalonServiceState("salonServicePrice", 0);
    updateSalonServiceState("salonServicePriceFormatted", "R$");
    updateSalonServiceState("salonServiceTypes", {});
    updateSalonServiceState("selectedSalonServiceTypes", []);
    updateSalonServiceState("salonServiceTime", "");
    updateSalonServiceState("salonServiceDescription", "");

    setLoading(true);

    getAllSalonServices()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: ISalonService[]) => {
              setSalonServices(data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter os Serviços.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Não foi possível obter os Serviços.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter os Serviços.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  const handleOnShow = (salonService: ISalonService) => {
    updateSalonServiceState("salonServiceId", salonService?.id);
    updateSalonServiceState("salonServiceName", salonService?.name);
    updateSalonServiceState("salonServicePrice", salonService?.price);
    updateSalonServiceState(
      "salonServicePriceFormatted",
      salonService?.priceFormatted
    );
    updateSalonServiceState(
      "salonServiceTypes",
      salonService?.serviceTypes ?? {}
    );
    updateSalonServiceState(
      "selectedSalonServiceTypes",
      salonService?.serviceTypes ? Object.keys(salonService?.serviceTypes) : []
    );
    updateSalonServiceState("salonServiceTime", salonService?.serviceTime);
    updateSalonServiceState(
      "salonServiceDescription",
      salonService?.description
    );

    setIsOpen((prevData) => ({
      ...prevData,
      ["salonServiceShowModal"]: true,
    }));
  };

  const handleOnSave = () => {
    createSalonService({
      name: salonServiceState.salonServiceName,
      price: salonServiceState.salonServicePrice,
      serviceTypes: salonServiceState.salonServiceTypes,
      selectedSalonServiceTypes: salonServiceState.selectedSalonServiceTypes,
      serviceTime: salonServiceState.salonServiceTime,
      description: salonServiceState.salonServiceDescription,
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Serviço cadastrado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["salonServiceSaveDrawer"]: false,
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
              title: "Não foi possível cadastrar o Serviço.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "Não foi possível cadastrar o Serviço.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao cadastrar Serviço.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleConfirmDelete = () => {
    setLoading(true);

    deleteSalonService(salonServiceState.salonServiceId)
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Serviço exluído com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível excluir o Serviço.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "Não foi possível excluir Serviço.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao excluir Serviço.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsOpen((prevData) => ({
          ...prevData,
          ["salonServiceDeleteAlert"]: false,
        }));

        setLoading(false);
      });
  };

  const handleOnDelete = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["salonServiceShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["salonServiceDeleteAlert"]: true,
    }));
  };

  const handleOnEdit = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["salonServiceShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["salonServiceEditDrawer"]: true,
    }));
  };

  const handleOnSaveEdit = () => {
    setLoading(true);

    editSalonService({
      id: salonServiceState.salonServiceId,
      name: salonServiceState.salonServiceName,
      price: salonServiceState.salonServicePrice,
      serviceTypes: salonServiceState.salonServiceTypes,
      selectedSalonServiceTypes: salonServiceState.selectedSalonServiceTypes,
      serviceTime: salonServiceState.salonServiceTime,
      description: salonServiceState.salonServiceDescription,
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Serviço editado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["salonServiceEditDrawer"]: false,
          }));
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível editar o Serviço.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "Não foi possível editar Serviço.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao editar Serviço.",
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
        <Heading>Serviços</Heading>
        <Button
          leftIcon={<MdAdd size={"2rem"} />}
          onClick={() =>
            setIsOpen((prevData) => ({
              ...prevData,
              ["salonServiceSaveDrawer"]: true,
            }))
          }
        >
          Novo
        </Button>
      </HStack>
      <Divider mt={2} mb={2} />
      <RenderWithLoading loading={loading}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
          {salonServices.map((m) => (
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
      <SalonServiceDrawer
        isOpen={isOpen["salonServiceSaveDrawer"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["salonServiceSaveDrawer"]: isOpen,
          }))
        }
        salonServiceTypes={salonServiceState.salonServiceTypes}
        selectedSalonServiceTypes={salonServiceState.selectedSalonServiceTypes}
        updateSalonServiceState={updateSalonServiceState}
        handleOnSave={handleOnSave}
      />
      <SalonServiceDrawer
        isEdit
        isOpen={isOpen["salonServiceEditDrawer"]}
        salonServiceName={salonServiceState.salonServiceName}
        salonServicePrice={salonServiceState.salonServicePrice}
        salonServiceTime={salonServiceState.salonServiceTime}
        salonServiceDescription={salonServiceState.salonServiceDescription}
        salonServiceTypes={salonServiceState.salonServiceTypes}
        selectedSalonServiceTypes={salonServiceState.selectedSalonServiceTypes}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["salonServiceEditDrawer"]: isOpen,
          }))
        }
        updateSalonServiceState={updateSalonServiceState}
        handleOnSave={handleOnSaveEdit}
      />
      <DeleteAlert
        handleOnDelete={handleConfirmDelete}
        isOpen={isOpen["salonServiceDeleteAlert"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["salonServiceDeleteAlert"]: isOpen,
          }))
        }
      />
      <CustomModal
        header="Detalhes"
        isOpen={isOpen["salonServiceShowModal"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["salonServiceShowModal"]: isOpen,
          }))
        }
      >
        <Stack>
          <HStack>
            <Heading size={"sm"}>Nome:</Heading>
            <Text>{salonServiceState.salonServiceName}</Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Valor:</Heading>
            <Text isTruncated>
              {salonServiceState.salonServicePriceFormatted}
            </Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Tipos:</Heading>
            <Text>
              {Object.values(salonServiceState.salonServiceTypes).join(", ")}
            </Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Duração:</Heading>
            <Text isTruncated>{salonServiceState.salonServiceTime}</Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Descrição:</Heading>
            <Text isTruncated>{salonServiceState.salonServiceDescription}</Text>
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

export default SalonService;
