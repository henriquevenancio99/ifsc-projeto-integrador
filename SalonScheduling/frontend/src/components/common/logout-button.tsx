import { Button } from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import { removeTokens } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const logout = () => {
    removeTokens();
    navigate("/login");
  };

  return (
    <Button
      mt={"auto"}
      alignSelf={"center"}
      w={"90%"}
      onClick={logout}
      aria-label="logout"
      leftIcon={<MdLogout size={"2rem"} />}
    >
      {"Sair"}
    </Button>
  );
};
