import { Stack, Input, Text, useToast } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IRole } from "../../types/role";
import { CustomDrawer } from "../common/custom-drawer";
import { useEffect, useState } from "react";
import { getAllRoles } from "../../services/role.service";
import { IUserState } from "../../types/user";

interface IProps {
  isEdit?: boolean;
  isOpen: boolean;
  username?: string;
  selectedRoles?: string[];
  updateUserState: (field: keyof IUserState, value: any) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleOnSave: () => void;
}

export const UserDrawer = ({
  isEdit = false,
  isOpen,
  username,
  selectedRoles,
  updateUserState,
  setIsOpen,
  handleOnSave,
}: IProps) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const toast = useToast();

  const header = isEdit ? "Editar usuário" : "Novo usuário";

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

  return (
    <CustomDrawer
      header={header}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSave={handleOnSave}
    >
      <Stack spacing={"2rem"}>
        <Stack>
          <Text>Username:</Text>
          <Input
            required
            type="email"
            placeholder="Informe o email"
            value={username}
            onChange={(e) => updateUserState("username", e.target.value)}
          />
        </Stack>
        {!isEdit && (
          <Stack>
            <Text>Senha:</Text>
            <Input
              required
              type="password"
              placeholder="Informe a senha"
              onChange={(e) => updateUserState("password", e.target.value)}
            />
          </Stack>
        )}
        <Stack>
          <Text>Permissões:</Text>
          <Select
            required
            placeholder="Selecione as permissões do usuário"
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
              updateUserState(
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
      </Stack>
    </CustomDrawer>
  );
};
