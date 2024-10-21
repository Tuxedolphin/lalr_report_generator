import { useEffect, useState } from "react";
import { createTheme } from "@mui/material";
import { AppProvider, DashboardLayout } from "@toolpad/core";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import Form from "./Form.tsx"

function App() {
  const theme = createTheme({
    cssVariables: {
      colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  console.log(theme);

  return (
    <AppProvider
      theme={theme}
      branding={{
        logo: <></>,
        title: "LALR Report Generator",
      }}
    >
      <DashboardLayout hideNavigation>
        <div className="Form">
          <Form theme={ theme }/>
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

export default App;
