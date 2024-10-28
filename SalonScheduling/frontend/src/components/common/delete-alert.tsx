import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleOnDelete: () => void;
}

export const DeleteAlert = ({ isOpen, setIsOpen, handleOnDelete }: IProps) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      size={"xs"}
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsOpen(false)}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontWeight="bold">
            Deletar registro
          </AlertDialogHeader>

          <AlertDialogBody>
            Você tem certeza que deseja deletar esse registro?
          </AlertDialogBody>

          <AlertDialogFooter>
            <HStack spacing={4}>
              <Button
                variant={"outline"}
                ref={cancelRef}
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleOnDelete}>Deletar</Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
