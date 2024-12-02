import { Stack, Input, Text, useToast, Switch } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IRole } from "../../types/role";
import { CustomDrawer } from "../common/custom-drawer";
import { useEffect, useState } from "react";
import { getAllRoles } from "../../services/role.service";
import { IEmployeeState } from "../../types/employee";
import { ISalonServiceOptions } from "../../types/salon-service";
import { getAllSalonServices } from "../../services/salon-service.service";

interface IProps {
  isEdit?: boolean;
  isOpen: boolean;
  employeeName?: string;
  employeeEmail?: string;
  employeePhoneNumber?: string;
  selectedRoles?: string[];
  selectedSalonServices?: string[];
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
  const toast = useToast();

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
            value={employeePhoneNumber}
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
      </Stack>
    </CustomDrawer>
  );
};
