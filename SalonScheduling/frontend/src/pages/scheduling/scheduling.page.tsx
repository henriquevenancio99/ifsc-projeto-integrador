import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  Divider,
  Heading,
  HStack,
  Stack,
  Tooltip,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core/index.js";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { RenderWithLoading } from "../../components/common/render-with-loading";
import { getAllClients } from "../../services/client.service";
import { IClient } from "../../types/client";
import { ISalonServiceOptions } from "../../types/salon-service";
import { getAllSalonServices } from "../../services/salon-service.service";
import { getAllEmployees } from "../../services/employee.service";
import { IEmployee } from "../../types/employee";
import { ISchedulerState, IScheduling } from "../../types/scheduling";
import {
  editScheduling,
  getAllSchedulings,
} from "../../services/scheduling.service";
import IErrorResponse from "../../types/common/error-response";
import { getErrorMessages } from "../../utils/error-response";
import SchedulingDialog from "../../components/scheduling/scheduling-dialog";

const Scheduling = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const calendarView = useBreakpointValue({
    base: "timeGridWeek",
  });

  const [schedulings, setSchedulings] = useState<IScheduling[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [salonServices, setSalonServices] = useState<ISalonServiceOptions[]>(
    []
  );
  const [isOpenNewScheduling, setIsOpenSchedulingDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isRefreshSchedulins, setIsRefreshSchedulins] = useState(false);

  const [schedulerState, setSchedulerState] = useState<ISchedulerState>({});

  const updateSchedulerState = (field: keyof ISchedulerState, value: any) => {
    setSchedulerState((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDateRangeSelected = (dateRangeSelected: DateSelectArg) => {
    const start = dateRangeSelected.startStr.includes("T")
      ? dateRangeSelected.startStr
      : `${dateRangeSelected.startStr}T00:00-03:00`;

    const end = dateRangeSelected.endStr.includes("T")
      ? dateRangeSelected.endStr
      : `${dateRangeSelected.startStr}T23:59-03:00`;

    updateSchedulerState("rangeSelected", {
      start: start,
      end: end,
    });
    setIsEdit(false);
    setIsOpenSchedulingDialog(true);
  };

  const handleEventDropAndResize = (resizeEvent: any) => {
    const scheduling = schedulings.find((f) => f.id == resizeEvent.event.id);

    if (scheduling) {
      const updatedScheduling = {
        ...scheduling,
        start: resizeEvent.event.startStr,
        end: resizeEvent.event.endStr,
      };

      editScheduling(updatedScheduling)
        .then((response) => {
          if (response.ok) {
            toast({
              title: "Agendamento editado com sucesso.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            setIsRefreshSchedulins((prev) => !prev);
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
    }
  };

  const handleEventClick = (clickEvent: EventClickArg) => {
    const scheduling = schedulings.find((f) => f.id == clickEvent.event.id);

    if (scheduling) {
      updateSchedulerState("schedulingSelected", scheduling);
      updateSchedulerState("rangeSelected", {
        start: scheduling.start,
        end: scheduling.end,
      });

      updateSchedulerState(
        "clientSelectd",
        clients
          .filter((f) => scheduling.clientId == f.id)
          .map((m) => ({
            label: m.name,
            value: m.id,
          }))[0]
      );

      updateSchedulerState(
        "employeesSelected",
        employees
          .filter((f) => scheduling.employeesIds.includes(f.id))
          .map((m) => ({
            label: m.name,
            value: m.id,
          }))
      );

      updateSchedulerState(
        "salonServicesSelected",
        salonServices
          .filter((f) => scheduling.salonServicesIds.includes(f.id))
          .map((m) => ({
            label: m.name,
            value: m.id,
          }))
      );

      setIsEdit(true);
      setIsOpenSchedulingDialog(true);
    }
  };

  useEffect(() => {
    if (isOpenNewScheduling) {
      return;
    }

    if (isEdit && !isOpenNewScheduling) {
      updateSchedulerState("schedulingSelected", undefined);
      updateSchedulerState("rangeSelected", undefined);
      updateSchedulerState("clientSelectd", undefined);
      updateSchedulerState("employeesSelected", []);
      updateSchedulerState("salonServicesSelected", []);
      setIsEdit(false);
    }

    getAllSchedulings()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: IScheduling[]) => {
              setSchedulings(data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter os agendamentos.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Não foi possível obter os agendamentos.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter os agendamentos.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [isOpenNewScheduling, isRefreshSchedulins]);

  useEffect(() => {
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
      });

    getAllEmployees()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: IEmployee[]) => {
              setEmployees(data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter os funcionários.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Não foi possível obter os funcionários.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter os funcionários.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });

    getAllSalonServices()
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((data: ISalonServiceOptions[]) => {
              setSalonServices(data);
            })
            .catch(() => {
              toast({
                title: "Não foi possível obter os serviços.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            });
        } else {
          toast({
            title: "Não foi possível obter os serviços.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch(() => {
        toast({
          title: "Erro ao obter os serviços.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    setLoading(false);
  }, []);

  return (
    <>
      <HStack justifyContent={"space-between"} spacing={2}>
        <Heading>Agendamentos</Heading>
      </HStack>
      <Divider mt={2} mb={2} />
      <RenderWithLoading loading={loading}>
        <Stack h={{ base: "76vh", md: "80vh" }} mb={{ base: 4, md: 0 }}>
          <FullCalendar
            height={"100%"}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={calendarView}
            editable={true}
            selectable={true}
            allDaySlot={false}
            nowIndicator={true}
            dayMaxEvents={2}
            events={schedulings}
            locale={ptBrLocale}
            longPressDelay={100}
            selectLongPressDelay={100}
            slotMinTime="05:00:00"
            slotMaxTime="23:59:59"
            headerToolbar={{
              start: "title",
              center: "",
              end: "dayGridMonth,timeGridWeek,today prev next",
            }}
            eventColor="#322659"
            eventBackgroundColor="#322659"
            eventContent={(eventInfo) => {
              const schedulingInterval = `${eventInfo.event.startStr
                .split("T")[1]
                .slice(0, 5)} ~ ${eventInfo.event.endStr
                .split("T")[1]
                .slice(0, 5)}`;

              const scheduling = schedulings.find(
                (f) => f.id == eventInfo.event.id
              );

              const clientName = clients.find(
                (f) => f.id == scheduling?.clientId
              )?.name;

              const employeesNames = employees
                .filter((f) => scheduling?.employeesIds.includes(f.id))
                .map((m) => m.name)
                .join(", ");

              const employeeTitle =
                (scheduling?.employeesIds.length ?? 0) > 1
                  ? `Funcionários: ${employeesNames}`
                  : `Funcionário: ${employeesNames}`;

              const label = `Horário: ${schedulingInterval} | Cliente: ${clientName} | ${employeeTitle}`;
              const isNotDayGridMont = eventInfo.view.type !== "dayGridMonth";

              return isNotDayGridMont ? (
                <Tooltip
                  label={label}
                  placement="auto-start"
                  bg={"#E2E8F0"}
                  color={"#322659"}
                  borderRadius={4}
                  hasArrow
                >
                  <Stack isTruncated h={"100%"}>
                    <Text>{schedulingInterval}</Text>
                    {clientName && (
                      <Text isTruncated>
                        {"-"} {clientName}
                      </Text>
                    )}
                    {employeesNames && (
                      <Text isTruncated>
                        {"-"} {employeesNames}
                      </Text>
                    )}
                  </Stack>
                </Tooltip>
              ) : (
                <Stack isTruncated h={"100%"}>
                  <Text>
                    {schedulingInterval}
                    {clientName ? ` - ${clientName}` : ""}
                  </Text>
                </Stack>
              );
            }}
            select={handleDateRangeSelected}
            eventDrop={handleEventDropAndResize}
            eventResize={handleEventDropAndResize}
            eventClick={handleEventClick}
          />
        </Stack>
      </RenderWithLoading>
      <SchedulingDialog
        isOpen={isOpenNewScheduling}
        setIsOpenSchedulingDialog={setIsOpenSchedulingDialog}
        isEdit={isEdit}
        clients={clients}
        employees={employees}
        salonServices={salonServices}
        schedulerState={schedulerState}
        updateSchedulerState={updateSchedulerState}
      />
    </>
  );
};

export default Scheduling;
