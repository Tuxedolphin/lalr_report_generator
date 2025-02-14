import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Toolbar,
} from "@mui/material";
import { useState, FC, useEffect } from "react";
import { useIsDarkModeContext } from "../utils/contextFunctions";
import ReportProvider from "../context/ReportProvider";

import Home from "./Pages/Home";
import History from "./Pages/History";
import AddEntryPage from "./Pages/AddEntryPage";
import Layout from "./Pages//Layout";

const App: FC = () => {
  const [text, setText] = useState("");

  const isDarkMode = useIsDarkModeContext() as boolean;

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Router>
        <Routes>
          <Route element={<Layout text={text} />}>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History setText={setText} />} />
            <Route
              path="/add_entry"
              element={
                <>
                  <ReportProvider>
                    <AddEntryPage setText={setText} />
                  </ReportProvider>
                </>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
