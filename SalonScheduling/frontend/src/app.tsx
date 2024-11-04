import { Center, Spinner } from "@chakra-ui/react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import { Routes } from "./routes/routes";
import { Suspense } from "react";

const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(Routes));

  return (
    <Suspense fallback={<Center h={"100vh"}><Spinner /></Center>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
