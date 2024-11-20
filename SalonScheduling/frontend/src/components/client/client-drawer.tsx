import { Stack, Input, Text } from "@chakra-ui/react";
import { CustomDrawer } from "../common/custom-drawer";
import { IClientState } from "../../types/client";

interface IProps {
  isEdit?: boolean;
  isOpen: boolean;
  clientName?: string;
  clientEmail?: string;
  clientPhoneNumber?: string;
  updateClientState: (field: keyof IClientState, value: any) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleOnSave: () => void;
}

export const ClientDrawer = ({
  isEdit = false,
  isOpen,
  clientName,
  clientEmail,
  clientPhoneNumber,
  updateClientState,
  setIsOpen,
  handleOnSave,
}: IProps) => {
  const header = isEdit ? "Editar cliente" : "Novo cliente";

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
            value={clientName}
            onChange={(e) => updateClientState("clientName", e.target.value)}
          />
        </Stack>
        <Stack>
          <Text>Email:</Text>
          <Input
            required
            type="email"
            placeholder="Informe o email"
            value={clientEmail}
            onChange={(e) => updateClientState("clientEmail", e.target.value)}
          />
        </Stack>
        <Stack>
          <Text>Celular:</Text>
          <Input
            required
            type="tel"
            placeholder="Informe o celular"
            value={clientPhoneNumber}
            onChange={(e) =>
              updateClientState("clientPhoneNumber", e.target.value)
            }
          />
        </Stack>
      </Stack>
    </CustomDrawer>
  );
};
