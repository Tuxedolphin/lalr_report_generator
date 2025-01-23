import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { IsDarkModeProvider } from "./context/AddReportContext.tsx";
// import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IsDarkModeProvider>
      <App />
    </IsDarkModeProvider>
  </StrictMode>
);
