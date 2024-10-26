import { IconButton, HStack } from "@chakra-ui/react";
import { IUser } from "../../types/user";
import { ITableContent } from "../../types/table";
import { CustomTable } from "../common/custom-table/custom-table";
import { MdDelete, MdEdit } from "react-icons/md";

interface IProps {
  users: IUser[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClickDelete: (user: IUser) => void;
  onClickEdit: (user: IUser) => void;
}

export const UserTable = ({
  users,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  loading,
  onClickDelete,
  onClickEdit,
}: IProps) => {
  const content: ITableContent = {
    headers: ["Usuário", "Permissões"],
    renderActionColumn: true,
    pagination: {
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      onPageChange: onPageChange,
    },
    rows: users.map((user) => ({
      key: user.id,
      cells: [user.username, user.roles.join(", ")],
      actions: (
        <HStack justifyContent={"center"} spacing={2}>
          <IconButton
            onClick={() => onClickEdit(user)}
            aria-label="Edit"
            icon={<MdEdit size={"1.5rem"} />}
          />
          <IconButton
            onClick={() => onClickDelete(user)}
            aria-label="Delete"
            icon={<MdDelete size={"1.5rem"} />}
          />
        </HStack>
      ),
    })),
  };

  return <CustomTable content={content} loading={loading} />;
};
