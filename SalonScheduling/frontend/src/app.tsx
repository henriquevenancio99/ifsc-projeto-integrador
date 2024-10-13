import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/home",
          lazy: async () => {
            const { Home } = await import("./pages/home.page");
            return { Component: Home };
          },
        },
        {
          path: "/login",
          lazy: async () => {
            const { Login } = await import("./pages/user/login.page");
            return { Component: Login };
          },
        },
      ],
    },
  ]);

  return (
    <Flex w="100vw" h="100vh">
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </Flex>
  );
};

export default App;
