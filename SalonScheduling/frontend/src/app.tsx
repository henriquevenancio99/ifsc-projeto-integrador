import { Spinner } from "@chakra-ui/react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import { Routes } from "./routes/routes";

const App = () => {
  const router = createBrowserRouter(createRoutesFromElements(Routes));

  return <RouterProvider router={router} fallbackElement={<Spinner />} />;
};

export default App;
