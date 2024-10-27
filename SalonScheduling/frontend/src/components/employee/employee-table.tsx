import { IconButton, HStack } from "@chakra-ui/react";
import { IEmployee } from "../../types/employee";
import { ITableContent } from "../../types/table";
import { CustomTable } from "../common/custom-table/custom-table";
import { MdDelete, MdEdit } from "react-icons/md";

interface IProps {
  employees: IEmployee[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClickDelete: (employee: IEmployee) => void;
  onClickEdit: (employee: IEmployee) => void;
}

export const EmployeeTable = ({
  employees,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  loading,
  onClickDelete,
  onClickEdit,
}: IProps) => {
  const content: ITableContent = {
    headers: ["Nome", "Email", "Celular"],
    renderActionColumn: true,
    pagination: {
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      onPageChange: onPageChange,
    },
    rows: employees.map((employee) => ({
      key: employee.id,
      cells: [
        employee.name,
        employee.contact.email,
        employee.contact.phoneNumber,
      ],
      actions: (
        <HStack justifyContent={"center"} spacing={2}>
          <IconButton
            onClick={() => onClickEdit(employee)}
            aria-label="Edit"
            icon={<MdEdit size={"1.5rem"} />}
          />
          <IconButton
            onClick={() => onClickDelete(employee)}
            aria-label="Delete"
            icon={<MdDelete size={"1.5rem"} />}
          />
        </HStack>
      ),
    })),
  };

  return <CustomTable content={content} loading={loading} />;
};
