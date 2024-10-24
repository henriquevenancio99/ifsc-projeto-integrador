import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./utils/theme";
// import { registerSW } from 'virtual:pwa-register'

// const updateSW = registerSW({
//   onNeedRefresh() {},
//   onOfflineReady() {},
// })

createRoot(document.getElementById("root")!).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
