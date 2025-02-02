import {
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Stack,
  Grid,
  Text,
  GridItem,
  Input,
  HStack,
  AlertDialogFooter,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useRef, useState } from "react";
import { BiTrash } from "react-icons/bi";
import {
  editScheduling,
  createScheduling,
  deleteScheduling,
} from "../../services/scheduling.service";
import { IClient } from "../../types/client";
import IErrorResponse from "../../types/common/error-response";
import { IEmployee } from "../../types/employee";
import { ISalonServiceOptions } from "../../types/salon-service";
import { ISchedulerState, IScheduling } from "../../types/scheduling";
import { getErrorMessages } from "../../utils/error-response";
import { generateGuid } from "../../utils/extensions";
import { DeleteAlert } from "../common/delete-alert";

interface IProps {
  isOpen: boolean;
  isEdit: boolean;
  clients: IClient[];
  employees: IEmployee[];
  salonServices: ISalonServiceOptions[];
  schedulerState: ISchedulerState;
  setIsOpenSchedulingDialog: (isOpen: boolean) => void;
  updateSchedulerState: (field: keyof ISchedulerState, value: any) => void;
}

const SchedulingDialog = ({
  isOpen,
  isEdit,
  clients,
  employees,
  salonServices,
  schedulerState,
  setIsOpenSchedulingDialog,
  updateSchedulerState,
}: IProps) => {
  const cancelRef = useRef(null);
  const toast = useToast();
  const [isOpenDeleteAlert, setIsOpenDeleteAlert] = useState(false);

  const handleUpsertScheduling = (isEdit: boolean) => {
    if (!schedulerState.rangeSelected) {
      toast({
        title:
          "A data de agendamento e o intervalo de horário devem ser informados.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    if (!schedulerState.clientSelectd) {
      toast({
        title: "O cliente deve ser informado.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    const upsertScheduling: IScheduling = {
      id: schedulerState.schedulingSelected?.id ?? generateGuid(),
      start: schedulerState.rangeSelected.start,
      end: schedulerState.rangeSelected.end,
      clientId: schedulerState.clientSelectd.value,
      employeesIds: (schedulerState.employeesSelected ?? []).map(
        (m) => m.value
      ),
      salonServicesIds: (schedulerState.salonServicesSelected ?? []).map(
        (m) => m.value
      ),
    };

    if (isEdit) {
      editScheduling(upsertScheduling)
        .then((response) => {
          if (response.ok) {
            toast({
              title: "Agendamento editado com sucesso.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setIsOpenSchedulingDialog(false);
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
                title: "Não foi possível editar o agendamento.",
                status: "error",
                duration: 3000,
                description: errorMessages,
                isClosable: true,
              });
            });
          } else {
            toast({
              title: "Não foi possível editar o agendamento.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Erro ao editar agendamento.",
            status: "error",
            description: error,
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      createScheduling(upsertScheduling)
        .then((response) => {
          if (response.ok) {
            toast({
              title: "Agendamento realizado com sucesso.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setIsOpenSchedulingDialog(false);
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
                title: "Não foi possível realizar o agendamento.",
                status: "error",
                duration: 3000,
                description: errorMessages,
                isClosable: true,
              });
            });
          } else {
            toast({
              title: "Não foi possível realizar o agendamento.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Erro ao realziat agendamento.",
            status: "error",
            description: error,
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const handleDeleteScheduling = () => {
    if (schedulerState.schedulingSelected) {
      deleteScheduling(schedulerState.schedulingSelected!.id)
        .then((response) => {
          if (response.ok) {
            toast({
              title: "Agendamento removido com sucesso.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            updateSchedulerState("schedulingSelected", undefined);
            setIsOpenDeleteAlert(false);
            setIsOpenSchedulingDialog(false);
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
                title: "Não foi possível remover o agendamento.",
                status: "error",
                duration: 3000,
                description: errorMessages,
                isClosable: true,
              });
            });
          } else {
            toast({
              title: "Não foi possível remover o agendamento.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Erro ao remover agendamento.",
            status: "error",
            description: error,
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };
console.log(schedulerState?.rangeSelected?.start)
console.log(schedulerState?.rangeSelected?.end)
  return (
    <>
      <AlertDialog
        size={{ base: "xs", md: "lg" }}
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpenSchedulingDialog(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              {isEdit ? "Editar Agendamento" : "Adicionar agendamento"}
            </AlertDialogHeader>
            <AlertDialogBody>
              <Stack>
                <Text>Data de Agendamento:</Text>
                <Grid
                  templateAreas={{
                    base: `"date  date"
                    "interval  interval"`,
                    md: `"date  interval"`,
                  }}
                >
                  <GridItem area={"date"} mb={{ base: "2", md: "auto" }}>
                    <Stack></Stack>
                    <Input
                      type="date"
                      value={
                        schedulerState.rangeSelected
                          ? schedulerState.rangeSelected.start.split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        if (schedulerState.rangeSelected) {
                          const newDate = e.target.value;
                          updateSchedulerState("rangeSelected", {
                            start: `${newDate}T${
                              schedulerState.rangeSelected.start.split("T")[1]
                            }`,
                            end: `${newDate}T${
                              schedulerState.rangeSelected.end.split("T")[1]
                            }`,
                          });
                        }
                      }}
                    />
                  </GridItem>
                  <GridItem area={"interval"} ml={{ base: "none", md: "2" }}>
                    <HStack
                      justifyContent={{ base: "space-between", md: "center" }}
                    >
                      <Input
                        type="time"
                        value={
                          schedulerState.rangeSelected?.start.includes("T")
                            ? schedulerState.rangeSelected.start
                                .split("T")[1]
                                .slice(0, 5)
                            : ""
                        }
                        onChange={(e) => {
                          if (schedulerState.rangeSelected) {
                            updateSchedulerState("rangeSelected", {
                              ...schedulerState.rangeSelected,
                              start: `${
                                schedulerState.rangeSelected.start.split("T")[0]
                              }T${e.target.value}`,
                            });
                          }
                        }}
                      />
                      <Input
                        type="time"
                        value={
                          schedulerState.rangeSelected?.end.includes("T")
                            ? schedulerState.rangeSelected.end
                                .split("T")[1]
                                .slice(0, 5)
                            : ""
                        }
                        onChange={(e) => {
                          if (schedulerState.rangeSelected) {
                            updateSchedulerState("rangeSelected", {
                              ...schedulerState.rangeSelected,
                              end: `${
                                schedulerState.rangeSelected.end.split("T")[0]
                              }T${e.target.value}`,
                            });
                          }
                        }}
                      />
                    </HStack>
                  </GridItem>
                </Grid>
              </Stack>
              <Stack mt={4}>
                <Text>Cliente:</Text>
                <Select
                  required
                  placeholder="Selecione o cliente"
                  value={
                    schedulerState.clientSelectd &&
                    clients
                      .filter(
                        (f) => schedulerState.clientSelectd!.value == f.id
                      )
                      .map((m) => ({
                        label: m.name,
                        value: m.id,
                      }))[0]
                  }
                  onChange={(option) => {
                    if (option) {
                      updateSchedulerState("clientSelectd", option);
                    }
                  }}
                  options={clients.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))}
                />
              </Stack>
              <Stack mt={4}>
                <Text>Funcionários:</Text>
                <Select
                  required
                  placeholder="Selecione os funcionários"
                  isMulti
                  value={schedulerState.employeesSelected}
                  onChange={(selectedOptions) =>
                    updateSchedulerState(
                      "employeesSelected",
                      selectedOptions.map((m) => ({
                        value: m.value,
                        label: m.label,
                      })) || []
                    )
                  }
                  options={employees.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))}
                />
              </Stack>
              <Stack mt={4}>
                <Text>Serviços:</Text>
                <Select
                  required
                  placeholder="Selecione os serviços"
                  isMulti
                  value={schedulerState.salonServicesSelected}
                  onChange={(selectedOptions) =>
                    updateSchedulerState(
                      "salonServicesSelected",
                      selectedOptions.map((m) => ({
                        value: m.value,
                        label: m.label,
                      })) || []
                    )
                  }
                  options={salonServices.map((m) => ({
                    label: m.name,
                    value: m.id,
                  }))}
                />
              </Stack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack
                justifyContent={"space-between"}
                w={isEdit ? "100%" : "auto"}
              >
                {isEdit && (
                  <IconButton
                    variant={"outline"}
                    colorScheme="red"
                    icon={<BiTrash size={"1.5rem"} />}
                    aria-label="delete"
                    onClick={() => setIsOpenDeleteAlert(true)}
                  />
                )}
                <HStack spacing={{ base: 2, md: 4 }}>
                  <Button
                    variant={"outline"}
                    ref={cancelRef}
                    onClick={() => setIsOpenSchedulingDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={() => handleUpsertScheduling(isEdit)}>
                    Salvar
                  </Button>
                </HStack>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <DeleteAlert
        handleOnDelete={handleDeleteScheduling}
        isOpen={isOpenDeleteAlert}
        setIsOpen={setIsOpenDeleteAlert}
      />
    </>
  );
};

export default SchedulingDialog;
