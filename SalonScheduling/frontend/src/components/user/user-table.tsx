import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Tfoot,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { IUser } from "../../types/user";

interface IProps {
  users: IUser[];
  loading: boolean;
  onClickDelete: (id: string) => void;
  onClickEdit: (user: IUser) => void;
}

export const UserTable = ({
  users,
  loading,
  onClickDelete,
  onClickEdit,
}: IProps) => {
  return (
    <TableContainer w={"100vw"}>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Usuário</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((m, index) => (
              <Tr key={index} textAlign={"center"}>
                <Td>{m.username}</Td>
                <Td>
                  <Menu>
                    <MenuButton as={Button}>...</MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => onClickDelete(m.id)}>
                        Excluir
                      </MenuItem>
                      <MenuItem onClick={() => onClickEdit(m)}>Editar</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      )}
    </TableContainer>
  );
};
