import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@emotion/react";
import muitheme from "./muitheme.ts";
import { BrowserRouter } from "react-router-dom";
import { lightTheme, darkTheme } from "./theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      {/* <BrowserRouter> */}
        <App />
      {/* </BrowserRouter> */}
    </ThemeProvider>
  </StrictMode>
);
