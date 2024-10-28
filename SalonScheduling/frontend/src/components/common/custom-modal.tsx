import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

interface IProps {
  header: string;
  children: React.ReactElement;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const CustomModal = ({ header, children, isOpen, setIsOpen }: IProps) => {
  return (
    <Modal
      size={{ base: "xs", sm: "md", md: "lg", lg: "lg" }}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={2}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
