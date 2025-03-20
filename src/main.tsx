import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import IsDarkModeProvider from "./context/IsDarkModeProvider.tsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IsDarkModeProvider>
      <App />
    </IsDarkModeProvider>
  </StrictMode>
);
