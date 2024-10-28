import { Stack, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import { Routes } from "./routes/routes";

const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(Routes));

  return (
    <Stack w={"100%"} p={4}>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </Stack>
  );
};

export default App;
