import {
  TableContainer,
  Center,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  HStack,
  Text,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { ITableContent } from "../../../types/table";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

interface IProps {
  content: ITableContent;
  loading: boolean;
}

export const CustomTable = ({ content, loading }: IProps) => {
  const tableFootColSpan =
    content.headers.length + (content.renderActionColumn ? 1 : 0);
  return (
    <Box overflow="hidden">
      <TableContainer w={"100vw"}>
        {loading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Table variant="striped">
            <Thead>
              <Tr>
                {content.headers.map((header, index) => (
                  <Th key={index}>{header}</Th>
                ))}
                {content.renderActionColumn && (
                  <Th textAlign="center">Ações</Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {content.rows.map((row) => (
                <Tr key={row.key}>
                  {row.cells.map((cell, index) => (
                    <Td key={index} maxW={"30vw"} isTruncated>
                      {cell}
                    </Td>
                  ))}
                  {content.renderActionColumn && (
                    <Td maxW={"1vw"} textAlign={"center"}>
                      {row.actions}
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Td colSpan={tableFootColSpan}>
                  <HStack justifyContent="center" mt={4} spacing={10}>
                    <IconButton
                      icon={<MdArrowBack size={"1.5rem"} />}
                      aria-label="PageBack"
                      onClick={() =>
                        content.pagination.onPageChange(
                          content.pagination.currentPage - 1
                        )
                      }
                      isDisabled={content.pagination.currentPage === 1}
                    />
                    <Text>{`Página ${content.pagination.currentPage} de ${content.pagination.totalPages}`}</Text>
                    <IconButton
                      icon={<MdArrowForward size={"1.5rem"} />}
                      aria-label="PageForward"
                      onClick={() =>
                        content.pagination.onPageChange(
                          content.pagination.currentPage + 1
                        )
                      }
                      isDisabled={
                        content.pagination.currentPage ===
                        content.pagination.totalPages
                      }
                    />
                  </HStack>
                </Td>
              </Tr>
            </Tfoot>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};
