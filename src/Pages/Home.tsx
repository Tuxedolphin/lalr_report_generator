import { useState } from "react";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Divider } from "@mui/material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import AddIncident from "../Components/AddIncidentButton.tsx";
import NavBar from "../Components/NavBar.tsx";
import ActionButton from "../Components/ActionButton.tsx";
import "./Home.css";

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Box className={"container"}>
        <ActionButton />
        <AddIncident />
        <Divider>LA</Divider>
        <AddIncident />
        <Divider>LR</Divider>
        <AddIncident />
      </Box>
    </ThemeProvider>
  );
}

export default Home;
