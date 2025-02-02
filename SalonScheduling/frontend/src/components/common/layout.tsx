import {
  IconButton,
  HStack,
  VStack,
  Text,
  Heading,
  Grid,
  GridItem,
  Link,
} from "@chakra-ui/react";
import {
  MdMenu,
  MdWork,
  MdManageAccounts,
  MdMenuOpen,
  MdGroup,
  MdSchedule,
} from "react-icons/md";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { LogoutButton } from "./logout-button";
import { FaCut } from "react-icons/fa";

interface ILinkItem {
  name: string;
  icon: React.ReactElement;
  path: string;
}

export const Layout = () => {
  const linkItems: ILinkItem[] = [
    {
      name: "Agendamentos",
      icon: <MdSchedule size={"2rem"} />,
      path: "/schedulings",
    },
    {
      name: "Clientes",
      icon: <MdGroup size={"2rem"} />,
      path: "/clients",
    },
    {
      name: "Funcionários",
      icon: <MdWork size={"2rem"} />,
      path: "/employees",
    },
    {
      name: "Serviços",
      icon: <FaCut size={"2rem"} />,
      path: "/salon-services",
    },
    {
      name: "Usuários",
      icon: <MdManageAccounts size={"2rem"} />,
      path: "/users",
    },
  ];

  return (
    <LayoutContent linkItems={linkItems}>
      <Outlet />
    </LayoutContent>
  );
};

interface ILayoutContentProps {
  children: React.ReactElement | string;
  linkItems: ILinkItem[];
}

export const LayoutContent = ({ linkItems, children }: ILayoutContentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Grid
      templateAreas={{
        base: `"header header"
                      "nav nav"
                      "main main"`,
        md: `"header  header"
                    "nav main"
                    "nav main"`,
      }}
      gridTemplateColumns={{
        base: "30vw",
        lg: "15vw",
      }}
    >
      <GridItem
        area={"header"}
        bg={"gray.200"}
        p={"2vh"}
        mb={{ base: isOpen ? "auto" : "2vh", md: "2vh" }}
      >
        <HStack justifyContent={{ base: "space-between", md: "center" }}>
          <Heading size={{ base: "md", md: "lg" }}>Salon Scheduling</Heading>
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            aria-label="open menu"
            icon={
              isOpen ? <MdMenuOpen size={"2rem"} /> : <MdMenu size={"2rem"} />
            }
          />
        </HStack>
      </GridItem>
      <GridItem
        area={"nav"}
        bg={"gray.200"}
        borderRadius={4}
        h={{ base: isOpen ? "100vh" : "auto", md: "88vh" }}
      >
        <VStack
          alignItems={"start"}
          display={{ base: "none", md: "flex" }}
          pt={"2vh"}
          h={"86vh"}
        >
          <Heading
            size={"lg"}
            pl={"1rem"}
            pb={"1vh"}
            display={{ base: "none", md: "flex" }}
          >
            Menu:
          </Heading>
          {!isOpen &&
            linkItems.map((link) => (
              <NavItem
                key={link.name}
                name={link.name}
                icon={link.icon}
                path={link.path}
              />
            ))}
          {!isOpen && <LogoutButton />}
        </VStack>
        {isOpen && (
          <VStack alignItems={"start"} h={"86vh"} w={"full"}>
            {linkItems.map((link) => (
              <NavItem
                key={link.name}
                name={link.name}
                icon={link.icon}
                path={link.path}
              />
            ))}
            {isOpen && <LogoutButton />}
          </VStack>
        )}
      </GridItem>
      <GridItem area={"main"} pl={4} pr={4} display={isOpen ? "none" : "block"}>
        {!isOpen && children}
      </GridItem>
    </Grid>
  );
};

const NavItem = ({ icon, name, path }: ILinkItem) => {
  return (
    <Link href={path} w={"full"}>
      <HStack p={"1rem"}>
        {icon}
        <Text>{name}</Text>
      </HStack>
    </Link>
  );
};
