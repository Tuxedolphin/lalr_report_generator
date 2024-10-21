import { useEffect, useState } from "react";
import { createTheme, useColorScheme, ThemeProvider, CssBaseline, Switch, SwitchProps } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";

import Form from "./Form.tsx";
import NavBar from "./NavBar.tsx";

function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light"
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Form />
    </ThemeProvider>
  );
}

export default App;
