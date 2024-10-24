import { Flex } from "@chakra-ui/react";
import { AuthProvider } from "./providers/auth";
import { Navigation } from "./components/common/navigation/navigation";

const App = () => {
  console.log("app");
  return (
    <Flex w="100vw" h="100vh">
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </Flex>
  );
};

export default App;
