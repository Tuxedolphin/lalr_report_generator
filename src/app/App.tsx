import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { FC, useState } from "react";
import { useIsDarkModeContext } from "../context/contextFunctions";
import ReportProvider from "../context/ReportProvider";

import Home from "./Pages/Home";
import History from "./Pages/History";
import AddEntryPage from "./Pages/AddEntryPage";
import Layout from "./Pages/Layout";
import DownloadPage from "./Pages/DownloadPage";
import { ReportGenerationStatusType } from "../types/types";

const App: FC = () => {
  const isDarkMode = useIsDarkModeContext() as boolean;

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const [generationStatus, setGenerationStatus] =
    useState<ReportGenerationStatusType>("none");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route
              path="/add_entry"
              element={
                <ReportProvider>
                  <AddEntryPage setGeneratingReport={setGenerationStatus} />
                </ReportProvider>
              }
            />
            <Route
              path="/download"
              element={
                <ReportProvider>
                  <DownloadPage
                    reportGenerationStatus={generationStatus}
                    setReportGenerationStatus={setGenerationStatus}
                  />
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
