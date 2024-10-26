import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";

interface IProps {
  isOpen: boolean;
  header: string;
  children: React.ReactElement;
  setIsOpen: (isOpen: boolean) => void;
  onSave: () => void;
}
export const CustomDrawer = ({
  isOpen,
  header,
  children,
  setIsOpen,
  onSave,
}: IProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => setIsOpen(false)}>
      <DrawerContent borderRadius={"lg"} minW={"50vw"}>
        <DrawerCloseButton />
        <DrawerHeader>{header}</DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Salvar</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
