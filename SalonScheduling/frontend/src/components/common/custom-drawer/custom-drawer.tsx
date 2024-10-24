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
  setIsOpen: (isOpen: boolean) => void;
  onSave: () => void;
  children: React.ReactElement;
}
export const CustomDrawer = ({
  isOpen,
  setIsOpen,
  onSave,
  children,
}: IProps) => {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => setIsOpen(false)}>
      <DrawerContent borderRadius={"lg"} minW={"50vw"}>
        <DrawerCloseButton />
        <DrawerHeader>Novo usuário</DrawerHeader>
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
