import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useState, FC, useRef, useEffect } from "react";

import "./App.css";
import Home from "./Pages/Home";
import AddEntryPage from "./Pages/AddEntryPage";
import Layout from "./Layout";

import { Report } from "./Classes/Report";

const App: FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [text, setText] = useState("");
  const [height, setHeight] = useState(56);

  //TODO: For testing only, to be removed
  const [newEntry, setNewEntry] = useState(new Report());
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  useEffect(() => {
    console.log(newEntry)
  }, [newEntry]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Router>
        <Routes>
          <Route
            element={
              <Layout
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                text={text}
                setHeight={setHeight}
              />
            }
          >
            <Route path="/" element={<Home setText={setText} />} />
            <Route
              path="/add_entry"
              element={
                <AddEntryPage
                  setText={setText}
                  reportEntry={newEntry}
                  setReportEntry={setNewEntry}
                  isDarkMode={isDarkMode}
                  navBarHeight={height}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
