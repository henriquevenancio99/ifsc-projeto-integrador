import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tag,
  TagLabel,
  TagCloseButton,
  AccordionPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Heading,
} from "@chakra-ui/react";
import { sortRecordByNumericPart } from "../../utils/extensions";
import { IWorkShift } from "../../types/employee";

interface IProps {
  isOpen?: boolean;
  availability?: Record<string, IWorkShift[]>;
  removeWorkShift?: (day: string, index: number) => void;
}

export const EmployeeAvailability = ({
  isOpen,
  availability,
  removeWorkShift,
}: IProps) => {
  return (
    <Accordion defaultIndex={[isOpen ? 0 : 1]} allowMultiple>
      <AccordionItem>
        <AccordionButton justifyContent={"center"} >
          <Heading size={"sm"}>Disponibilidade:</Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel padding={"0"}>
          <Table>
            <Thead>
              <Tr>
                <Th>Dias</Th>
                <Th>Turnos</Th>
              </Tr>
            </Thead>
            <Tbody>
              {availability &&
                Object.keys(sortRecordByNumericPart(availability)).map(
                  (day) => (
                    <Tr key={day}>
                      <Td maxW={{ base: "25vw", md: "auto" }} isTruncated>
                        {day.split(":")[1]}
                      </Td>
                      <Td minW={{ base: "35vw", md: "auto" }}>
                        {availability[day].map((shift, index) => (
                          <Tag key={index} m={1}>
                            <TagLabel
                              fontSize={"xs"}
                            >{`${shift.startTime} - ${shift.endTime}`}</TagLabel>
                            {removeWorkShift && (
                              <TagCloseButton
                                onClick={() => removeWorkShift(day, index)}
                                aria-label="Remove shift"
                              />
                            )}
                          </Tag>
                        ))}
                      </Td>
                    </Tr>
                  )
                )}
            </Tbody>
          </Table>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
