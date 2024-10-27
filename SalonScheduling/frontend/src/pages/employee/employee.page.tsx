import {
  Button,
  Flex,
  Heading,
  Spacer,
  StackDivider,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { DeleteAlert } from "../../components/common/delete-alert/delete-alert";
import { IEmployeeState, IEmployee } from "../../types/employee";
import {
  createEmployee,
  deleteEmployee,
  editEmployee,
  getAllEmployees,
} from "../../services/employee.service";

import { EmployeeDrawer } from "../../components/employee/emplyee-drawer";
import { EmployeeTable } from "../../components/employee/employee-table";

export const Employee = () => {
  const toast = useToast();
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  type DrawerKeys =
    | "employeeSaveDrawer"
    | "employeeEditDrawer"
    | "employeeDeleteAlert";

  type IsOpenState = { [key in DrawerKeys]: boolean };

  const [isOpen, setIsOpen] = useState<IsOpenState>({
    employeeSaveDrawer: false,
    employeeEditDrawer: false,
    employeeDeleteAlert: false,
  });

  const [employeeState, setEmployeeState] = useState<IEmployeeState>({
    employeeId: "",
    employeeName: "",
    employeeEmail: "",
    employeePhoneNumber: "",
    password: "",
    selectedRoles: [],
  });

  const updateEmployeeState = (field: keyof IEmployeeState, value: any) => {
    setEmployeeState((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      isOpen.employeeSaveDrawer ||
      isOpen.employeeEditDrawer ||
      isOpen.employeeDeleteAlert ||
      loading
    ) {
      return;
    }

    updateEmployeeState("employeeId", "");
    updateEmployeeState("employeeName", "");
    updateEmployeeState("employeeEmail", "");
    updateEmployeeState("employeePhoneNumber", "");
    updateEmployeeState("password", "");
    updateEmployeeState("selectedRoles", []);

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
  }, [isOpen, loading]);

  const handleOnSave = () => {
    createEmployee({
      name: employeeState.employeeName,
      contact: {
        email: employeeState.employeeEmail,
        phoneNumber: employeeState.employeePhoneNumber,
      },
      createUser: !!employeeState.password,
      userPassword: employeeState.password,
      userRoles: employeeState.selectedRoles,
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Funcionário cadastrado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["employeeSaveDrawer"]: false,
          }));
        } else {
          toast({
            title: "Não foi possível cadastrar o funcionário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao cadastrar funcionário.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleConfirmDelete = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeDeleteAlert"]: false,
    }));

    setLoading(true);

    deleteEmployee(employeeState.employeeId)
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Funcionário exluído com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Não foi possível excluir funcionário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao excluir funcionário.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnDelete = (employee: IEmployee) => {
    updateEmployeeState("employeeId", employee.id);
    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeDeleteAlert"]: true,
    }));
  };

  const handleOnEdit = (employee: IEmployee) => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeEditDrawer"]: true,
    }));

    updateEmployeeState("employeeId", employee.id);
    updateEmployeeState("employeeName", employee.name);
    updateEmployeeState("employeeEmail", employee.contact.email);
    updateEmployeeState("employeePhoneNumber", employee.contact.phoneNumber);
  };

  const handleOnSaveEdit = () => {
    setLoading(true);

    editEmployee({
      id: employeeState.employeeId,
      name: employeeState.employeeName,
      contact: {
        email: employeeState.employeeEmail,
        phoneNumber: employeeState.employeePhoneNumber,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast({
            title: "Funcionário editado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsOpen((prevData) => ({
            ...prevData,
            ["employeeEditDrawer"]: false,
          }));
        } else {
          toast({
            title: "Não foi possível editar funcionário.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Erro ao editar funcionário.",
          status: "error",
          description: error,
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <DeleteAlert
        handleOnDelete={handleConfirmDelete}
        isOpen={isOpen["employeeDeleteAlert"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["employeeDeleteAlert"]: isOpen,
          }))
        }
      />
      <VStack spacing={2} divider={<StackDivider />}>
        <Flex w={"100vw"} p={4}>
          <Heading>Funcionários</Heading>
          <Spacer />
          <Button
            leftIcon={<MdAdd size={"2rem"} />}
            onClick={() =>
              setIsOpen((prevData) => ({
                ...prevData,
                ["employeeSaveDrawer"]: true,
              }))
            }
          >
            Novo
          </Button>
        </Flex>
        <EmployeeTable
          employees={employees}
          loading={loading}
          currentPage={1}
          pageSize={10}
          totalPages={1}
          onPageChange={() => console.log("MUDOU DE PAGINA")}
          onClickDelete={handleOnDelete}
          onClickEdit={handleOnEdit}
        />
      </VStack>
      <EmployeeDrawer
        isOpen={isOpen["employeeSaveDrawer"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["employeeSaveDrawer"]: isOpen,
          }))
        }
        updateEmployeeField={updateEmployeeState}
        handleOnSave={handleOnSave}
      />
      <EmployeeDrawer
        isEdit
        isOpen={isOpen["employeeEditDrawer"]}
        employeeName={employeeState.employeeName}
        employeeEmail={employeeState.employeeEmail}
        employeePhoneNumber={employeeState.employeePhoneNumber}
        selectedRoles={employeeState.selectedRoles}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["employeeEditDrawer"]: isOpen,
          }))
        }
        updateEmployeeField={updateEmployeeState}
        handleOnSave={handleOnSaveEdit}
      />
    </>
  );
};
