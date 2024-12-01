import {
  Button,
  Card,
  CardHeader,
  Heading,
  useToast,
  Text,
  HStack,
  Stack,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { DeleteAlert } from "../../components/common/delete-alert";
import { IEmployeeState, IEmployee } from "../../types/employee";
import {
  createEmployee,
  deleteEmployee,
  editEmployee,
  getAllEmployees,
} from "../../services/employee.service";

import { EmployeeDrawer } from "../../components/employee/emplyee-drawer";
import { BiTrash, BiEdit, BiShow } from "react-icons/bi";
import { CustomModal } from "../../components/common/custom-modal";
import { getErrorMessages } from "../../utils/error-response";
import IErrorResponse from "../../types/common/error-response";
import { RenderWithLoading } from "../../components/common/render-with-loading";

type DrawerKeys =
  | "employeeSaveDrawer"
  | "employeeEditDrawer"
  | "employeeDeleteAlert"
  | "employeeShowModal";

type IsOpenState = { [key in DrawerKeys]: boolean };

const Employee = () => {
  const toast = useToast();
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  const [isOpen, setIsOpen] = useState<IsOpenState>({
    employeeSaveDrawer: false,
    employeeEditDrawer: false,
    employeeDeleteAlert: false,
    employeeShowModal: false,
  });

  const [loading, setLoading] = useState(false);

  const [employeeState, setEmployeeState] = useState<IEmployeeState>({
    employeeId: "",
    employeeName: "",
    employeeEmail: "",
    employeePhoneNumber: "",
    password: "",
    selectedRoles: [],
  });

  useEffect(() => {
    if (
      isOpen.employeeSaveDrawer ||
      isOpen.employeeEditDrawer ||
      isOpen.employeeDeleteAlert ||
      isOpen.employeeShowModal
    ) {
      return;
    }

    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

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
              title: "Não foi possível cadastrar o funcionário.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
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
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível excluir funcionário.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
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
        setIsOpen((prevData) => ({
          ...prevData,
          ["employeeDeleteAlert"]: false,
        }));
        setLoading(false);
      });
  };

  const handleOnDelete = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeDeleteAlert"]: true,
    }));
  };

  const handleOnEdit = () => {
    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeShowModal"]: false,
    }));
    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeEditDrawer"]: true,
    }));
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
        } else if (response.status == 400) {
          response.json().then((data: IErrorResponse) => {
            const errorMessages = getErrorMessages(data);

            toast({
              title: "Não foi possível editar funcionário.",
              status: "error",
              duration: 3000,
              description: errorMessages,
              isClosable: true,
            });
          });
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

  const handleOnShow = (employee: IEmployee) => {
    updateEmployeeState("employeeId", employee?.id);
    updateEmployeeState("employeeName", employee?.name);
    updateEmployeeState("employeeEmail", employee?.contact.email);
    updateEmployeeState("employeePhoneNumber", employee?.contact.phoneNumber);

    setIsOpen((prevData) => ({
      ...prevData,
      ["employeeShowModal"]: true,
    }));
  };

  const updateEmployeeState = (field: keyof IEmployeeState, value: any) => {
    setEmployeeState((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <>
      <HStack justifyContent={"space-between"} spacing={2}>
        <Heading>Funcionários</Heading>
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
      </HStack>
      <Divider mt={2} mb={2} />
      <RenderWithLoading loading={loading}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
          {employees.map((m) => (
            <Button
              key={m.id}
              variant={"outline"}
              boxShadow={"xl"}
              h={"100%"}
              pr={10}
              rightIcon={<BiShow size={"2rem"} />}
              onClick={() => handleOnShow(m)}
            >
              <Card w={"100%"} bg={"transparent"} boxShadow={"none"}>
                <CardHeader>
                  <HStack justifyContent={"space-between"}>
                    <Heading size={"md"} isTruncated>
                      {m.name}
                    </Heading>
                  </HStack>
                </CardHeader>
              </Card>
            </Button>
          ))}
        </SimpleGrid>
      </RenderWithLoading>
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
        employeeName={employeeState?.employeeName}
        employeeEmail={employeeState?.employeeEmail}
        employeePhoneNumber={employeeState?.employeePhoneNumber}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["employeeEditDrawer"]: isOpen,
          }))
        }
        updateEmployeeField={updateEmployeeState}
        handleOnSave={handleOnSaveEdit}
      />
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
      <CustomModal
        header="Detalhes"
        isOpen={isOpen["employeeShowModal"]}
        setIsOpen={(isOpen) =>
          setIsOpen((prevData) => ({
            ...prevData,
            ["employeeShowModal"]: isOpen,
          }))
        }
      >
        <Stack>
          <HStack>
            <Heading size={"sm"}>Nome:</Heading>
            <Text>{employeeState.employeeName}</Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Email:</Heading>
            <Text isTruncated>{employeeState.employeeEmail}</Text>
          </HStack>
          <HStack>
            <Heading size={"sm"}>Celular:</Heading>
            <Text>{employeeState.employeePhoneNumber}</Text>
          </HStack>
          <Divider mt={2} mb={2} />
          <HStack justify={"end"}>
            <Button leftIcon={<BiEdit />} onClick={() => handleOnEdit()}>
              Editar
            </Button>
            <Button leftIcon={<BiTrash />} onClick={() => handleOnDelete()}>
              Deletar
            </Button>
          </HStack>
        </Stack>
      </CustomModal>
    </>
  );
};

export default Employee;
