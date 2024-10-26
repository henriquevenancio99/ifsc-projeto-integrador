import { Stack, Input, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IRole } from "../../types/role";
import { CustomDrawer } from "../common/custom-drawer/custom-drawer";

interface IProps {
  isEdit?: boolean;
  isOpen: boolean;
  username?: string;
  roles: IRole[];
  selectedRoles?: string[];
  setIsOpen: (isOpen: boolean) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setSelectedRoles: (selectedRoles: string[]) => void;
  handleOnSave: () => void;
}

export const UserDrawer = ({
  isEdit = false,
  isOpen,
  username,
  roles,
  selectedRoles,
  setIsOpen,
  setUsername,
  setPassword,
  setSelectedRoles,
  handleOnSave,
}: IProps) => {
  const header = isEdit ? "Editar usuário" : "Novo usuário";
  return (
    <CustomDrawer
      header={header}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSave={handleOnSave}
    >
      <Stack spacing={"2rem"}>
        <Stack>
          <Text>Email:</Text>
          <Input
            required
            type="email"
            placeholder="Informe o email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Stack>
        {!isEdit && (
          <Stack>
            <Text>Senha:</Text>
            <Input
              required
              type="password"
              placeholder="Informe a senha"
              onChange={(e) => setPassword(e.target.value)}
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
              setSelectedRoles(selectedOptions.map((m) => m.label))
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
