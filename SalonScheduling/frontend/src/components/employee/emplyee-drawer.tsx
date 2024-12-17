import {
  Stack,
  Input,
  Text,
  useToast,
  Switch,
  Checkbox,
  CheckboxGroup,
  HStack,
  IconButton,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IRole } from "../../types/role";
import { CustomDrawer } from "../common/custom-drawer";
import { useEffect, useState } from "react";
import { getAllRoles } from "../../services/role.service";
import { IEmployeeState, IWorkShift } from "../../types/employee";
import { ISalonServiceOptions } from "../../types/salon-service";
import { getAllSalonServices } from "../../services/salon-service.service";
import { MdAdd } from "react-icons/md";
import { weekDays } from "../../utils/extensions";
import { EmployeeAvailability } from "./employee-availability";

interface IProps {
  isEdit?: boolean;
  isOpen: boolean;
  employeeName?: string;
  employeeEmail?: string;
  employeePhoneNumber?: string;
  selectedRoles?: string[];
  selectedSalonServices?: string[];
  availability?: Record<string, IWorkShift[]>;
  updateEmployeeField: (field: keyof IEmployeeState, value: any) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleOnSave: () => void;
}

export const EmployeeDrawer = ({
  isEdit = false,
  isOpen,
  employeeName,
  employeeEmail,
  employeePhoneNumber,
  selectedRoles,
  selectedSalonServices,
  availability,
  updateEmployeeField,
  setIsOpen,
  handleOnSave,
}: IProps) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [salonServices, setSalonServices] = useState<ISalonServiceOptions[]>(
    []
  );
  const [createUser, setCreateUser] = useState(false);
  const [bindSalonServices, setBindSalonServices] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const toast = useToast();

  const handleAddAvailability = () => {
    if (selectedDays.length === 0 || !startTime || !endTime) {
      toast({
        title: "Informe os dias da semana e o intervalo",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (endTime <= startTime) {
      toast({
        title: "O horário inicial deve ser menor que o horário final",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedAvailability = { ...availability };

    selectedDays.forEach((day) => {
      if (!updatedAvailability[day]) {
        updatedAvailability[day] = [];
      }
      updatedAvailability[day].push({ startTime, endTime });
    });

    updateEmployeeField("availability", updatedAvailability);

    setSelectedDays([]);
    setStartTime("");
    setEndTime("");
  };

  const removeWorkShift = (day: string, index: number) => {
    const updatedAvailability = { ...availability };

    if (updatedAvailability[day]) {
      updatedAvailability[day] = updatedAvailability[day].filter(
        (_, i) => i !== index
      );
      if (updatedAvailability[day].length === 0) {
        delete updatedAvailability[day];
      }
    }

    updateEmployeeField("availability", updatedAvailability);
  };

  const header = isEdit ? "Editar funcionário" : "Novo funcionário";

  useEffect(() => {
    if (!isOpen) return;

    if (!isEdit) {
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
                  title: "Não foi possível obter as permissões de funcionário.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              });
          } else {
            toast({
              title: "Não foi possível obter as permissões de funcionário.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        })
        .catch(() => {
          toast({
            title: "Erro ao obter as permissões de funcionário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }

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

    return () => {
      setCreateUser(false);
      setBindSalonServices(false);
    };
  }, [isOpen]);

  return (
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
            placeholder="Informe o nome"
            value={employeeName}
            onChange={(e) =>
              updateEmployeeField("employeeName", e.target.value)
            }
          />
        </Stack>
        <Stack>
          <Text>Email:</Text>
          <Input
            required
            type="email"
            placeholder="Informe o email"
            value={employeeEmail}
            onChange={(e) =>
              updateEmployeeField("employeeEmail", e.target.value)
            }
          />
        </Stack>
        <Stack>
          <Text>Celular:</Text>
          <Input
            required
            type="tel"
            placeholder="Informe o celular"
            value={employeePhoneNumber ?? ""}
            onChange={(e) =>
              updateEmployeeField("employeePhoneNumber", e.target.value)
            }
          />
        </Stack>
        {!isEdit && (
          <>
            <Stack>
              <Switch
                checked={createUser}
                onChange={(e) => setCreateUser(e.target.checked)}
              >
                Deseja vincular usuário?
              </Switch>
            </Stack>
            {createUser && (
              <>
                <Stack>
                  <Text>Senha:</Text>
                  <Input
                    required
                    type="password"
                    placeholder="Informe a senha"
                    onChange={(e) =>
                      updateEmployeeField("password", e.target.value)
                    }
                  />
                </Stack>
                <Stack>
                  <Text>Permissões:</Text>
                  <Select
                    required
                    placeholder="Selecione as permissões do funcionário"
                    isMulti
                    value={
                      selectedRoles &&
                      roles
                        .filter((f) => selectedRoles.includes(f.name))
                        .map((m) => ({
                          label: m.name,
                          value: m.id,
                        }))
                    }
                    onChange={(selectedOptions) =>
                      updateEmployeeField(
                        "selectedRoles",
                        selectedOptions.map((m) => m.label)
                      )
                    }
                    options={roles.map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))}
                  />
                </Stack>
              </>
            )}
          </>
        )}

        <>
          {!isEdit && (
            <Stack>
              <Switch
                checked={createUser}
                onChange={(e) => setBindSalonServices(e.target.checked)}
              >
                Deseja vincular serviços?
              </Switch>
            </Stack>
          )}
          {(isEdit || bindSalonServices) && (
            <Stack>
              <Text>Serviços:</Text>
              <Select
                required
                placeholder="Selecione os serviços"
                isMulti
                value={
                  selectedSalonServices &&
                  salonServices
                    .filter((f) => selectedSalonServices.includes(f.id))
                    .map((m) => ({
                      label: m.name,
                      value: m.id,
                    }))
                }
                onChange={(selectedOptions) =>
                  updateEmployeeField(
                    "selectedSalonServices",
                    selectedOptions.map((m) => m.value)
                  )
                }
                options={salonServices.map((m) => ({
                  label: m.name,
                  value: m.id,
                }))}
              />
            </Stack>
          )}
        </>
        <Stack>
          <Divider mb={2} />
          <Text>
            Informe os turnos de trabalho para os dias da semana selecionados:
          </Text>
          <CheckboxGroup
            value={selectedDays}
            onChange={(values) => setSelectedDays(values as string[])}
          >
            <SimpleGrid columns={{ base: 2, md: 3, lg: 5, xl: 7 }} spacing={4}>
              {weekDays.map((day) => (
                <Checkbox key={day} value={day}>
                  {day.split(":")[1]}
                </Checkbox>
              ))}
            </SimpleGrid>
          </CheckboxGroup>
          <HStack mt={4}>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <IconButton
              icon={<MdAdd size={"2rem"} />}
              aria-label=""
              onClick={handleAddAvailability}
            />
          </HStack>
          <EmployeeAvailability
            isOpen
            availability={availability}
            removeWorkShift={removeWorkShift}
          />
        </Stack>
      </Stack>
    </CustomDrawer>
  );
};
