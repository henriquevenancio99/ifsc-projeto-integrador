import {
  Stack,
  Input,
  Text,
  HStack,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { CustomDrawer } from "../common/custom-drawer";
import { ISalonServiceState } from "../../types/salon-service";
import { Select } from "chakra-react-select";
import { MdAdd, MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { getAllSalonServiceTypes } from "../../services/salon-service.service";

interface IProps {
  isEdit?: boolean;
  isOpen: boolean;
  salonServiceName?: string;
  salonServicePrice?: number;
  salonServiceTime?: string;
  salonServiceDescription?: string;
  salonServiceTypes?: Record<string, string>;
  selectedSalonServiceTypes?: string[];
  updateSalonServiceState: (
    field: keyof ISalonServiceState,
    value: any
  ) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleOnSave: () => void;
}

export const SalonServiceDrawer = ({
  isEdit = false,
  isOpen,
  salonServiceName,
  salonServicePrice,
  salonServiceTime,
  salonServiceDescription,
  salonServiceTypes,
  selectedSalonServiceTypes,
  updateSalonServiceState,
  setIsOpen,
  handleOnSave,
}: IProps) => {
  const header = isEdit ? "Editar Serviço" : "Novo Serviço";

  const cancelRef = useRef(null);

  const [isOpenNewSalonServiceType, setIsOpenNewSalonServiceType] =
    useState(false);

  const [newSalonServiceType, setNewSalonServiceType] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (!isOpen) return;

    getAllSalonServiceTypes()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: Record<string, string>) => {
              updateSalonServiceState("salonServiceTypes", data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter os tipos de serviços.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Não foi possível obter os tipos de serviços.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter os tipos de serviços.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [isOpen]);

  const handleAddServiceType = () => {
    const currentOptions =
      salonServiceTypes && Object.values(salonServiceTypes);

    if (
      newSalonServiceType &&
      (currentOptions?.length == 0 ||
        (currentOptions && !currentOptions.includes(newSalonServiceType)))
    ) {
      const newSalonServiceTypeKey = crypto.randomUUID().toString();

      updateSalonServiceState("salonServiceTypes", {
        ...salonServiceTypes,
        [newSalonServiceTypeKey]: newSalonServiceType,
      });

      updateSalonServiceState("selectedSalonServiceTypes", [
        ...(selectedSalonServiceTypes ?? []),
        newSalonServiceTypeKey,
      ]);
    }
  };

  const handleSaveEditServiceTypes = () => {
    setIsOpenNewSalonServiceType(false);
  };

  const removeOption = (key: string) => {
    const updatedOptions = { ...salonServiceTypes };
    delete updatedOptions[key];
    updateSalonServiceState("salonServiceTypes", updatedOptions);
  };

  return (
    <>
      <CustomDrawer
        header={header}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSave={handleOnSave}
      >
        <Stack spacing={"2rem"}>
          <Stack>
            <Text>Nome:</Text>
            <Input
              required
              placeholder="Informe o nome do serviço"
              value={salonServiceName}
              onChange={(e) =>
                updateSalonServiceState("salonServiceName", e.target.value)
              }
            />
          </Stack>
          <Stack>
            <Text>Valor:</Text>
            <Input
              type="number"
              placeholder="Informe o valor do serviço"
              value={salonServicePrice}
              onChange={(e) =>
                updateSalonServiceState("salonServicePrice", e.target.value)
              }
            />
          </Stack>
          <Stack>
            <Text>Tipos:</Text>
            <HStack>
              <Stack w={"100%"}>
                <Select
                  placeholder="Selecione os tipos de serviços"
                  isMulti
                  value={
                    selectedSalonServiceTypes &&
                    salonServiceTypes &&
                    Object.entries(salonServiceTypes)
                      .filter(([key]) =>
                        selectedSalonServiceTypes.includes(key)
                      )
                      .map(([key, value]) => ({
                        label: value,
                        value: key,
                      }))
                  }
                  onChange={(selectedOptions) =>
                    updateSalonServiceState(
                      "selectedSalonServiceTypes",
                      selectedOptions.map((m) => m.value)
                    )
                  }
                  options={
                    salonServiceTypes &&
                    Object.entries(salonServiceTypes).map(([key, value]) => ({
                      label: value,
                      value: key,
                    }))
                  }
                />
              </Stack>
              <IconButton
                icon={<MdEdit size={"1.5rem"} />}
                onClick={() => setIsOpenNewSalonServiceType(true)}
                aria-label={""}
              />
            </HStack>
          </Stack>
          <Stack>
            <Text>Duração:</Text>
            <Input
              type="time"
              placeholder="Informe a duração do serviço"
              value={salonServiceTime}
              onChange={(e) =>
                updateSalonServiceState("salonServiceTime", e.target.value)
              }
            />
          </Stack>
          <Stack>
            <Text>Descrição:</Text>
            <Input
              value={salonServiceDescription}
              onChange={(e) =>
                updateSalonServiceState(
                  "salonServiceDescription",
                  e.target.value
                )
              }
            />
          </Stack>
        </Stack>
      </CustomDrawer>

      <AlertDialog
        size={"md"}
        isOpen={isOpenNewSalonServiceType}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpenNewSalonServiceType(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontWeight="bold">
              Editar tipos de serviço:
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stack>
                <Text>Adicionar novo tipo de serviço:</Text>
                <HStack>
                  <Input
                    required
                    placeholder="Informe o nome do tipo de serviço"
                    value={newSalonServiceType}
                    onChange={(e) => setNewSalonServiceType(e.target.value)}
                  />
                  <IconButton
                    icon={<MdAdd size={"1.5rem"} />}
                    onClick={handleAddServiceType}
                    aria-label={""}
                  />
                </HStack>
                <Divider mt={4} />
                <Text>Tipos de serviço disponíveis:</Text>
                <HStack>
                  {Object.entries(salonServiceTypes ?? {}).map(
                    ([key, value]) => (
                      <Tag key={key}>
                        <TagLabel>{value}</TagLabel>
                        <TagCloseButton onClick={() => removeOption(key)} />
                      </Tag>
                    )
                  )}
                </HStack>
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <HStack spacing={4}>
                <Button
                  variant={"outline"}
                  ref={cancelRef}
                  onClick={() => setIsOpenNewSalonServiceType(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSaveEditServiceTypes}>Salvar</Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
