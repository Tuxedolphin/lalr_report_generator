import { FC, useState } from "react";
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

interface HomeProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const Home: FC<HomeProps> = (props) => {
  props.setText("LALR Generator");

  return (
    
    <ActionButton />
  );
};

export default Home;
