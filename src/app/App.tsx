import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useState, FC, useEffect } from "react";
import { Report } from "../classes/Report";
import { useIsDarkModeContext } from "../utils/contextFunctions";
import { ReportProvider } from "../context/AddReportContext";

import Home from "./Pages/Home";
import History from "./Pages/History";
import AddEntryPage from "./Pages/AddEntryPage";
import Layout from "./Pages//Layout";

const App: FC = () => {
  const [text, setText] = useState("");
  const [height, setHeight] = useState(56);

  //TODO: For testing only, to be removed
  const [newEntry, setNewEntry] = useState(new Report());

  const isDarkMode = useIsDarkModeContext() as boolean;

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    console.log(newEntry);
  }, [newEntry]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Router>
        <Routes>
          <Route element={<Layout text={text} setHeight={setHeight} />}>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History setText={setText} />} />
            <Route
              path="/add_entry"
              element={
                <ReportProvider>
                  <AddEntryPage setText={setText} navBarHeight={height} />
                </ReportProvider>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
