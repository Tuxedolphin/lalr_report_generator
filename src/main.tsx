import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import IsDarkModeProvider from "./context/IsDarkModeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IsDarkModeProvider>
      <App />
    </IsDarkModeProvider>
  </StrictMode>
);
