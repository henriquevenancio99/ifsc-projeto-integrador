import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import { Routes } from "../../../routes/routes";

export const Navigation = () => {
  const router = createBrowserRouter(createRoutesFromElements(Routes));

  return (
    <Suspense fallback={<Spinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
