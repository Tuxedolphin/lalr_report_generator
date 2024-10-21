import { AppBar, Toolbar, Typography, Button, Mode } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FC, useState, useEffect } from "react";
import { DarkModeSwitch } from "animated-toggle-button";

interface NavProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar: FC<NavProps> = (props) => {
  const { isDarkMode, setIsDarkMode } = props;

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  return (
    <AppBar>
      <Toolbar>
        <Grid container width={"100%"} spacing={2}>
          <Grid size="grow"></Grid>
          <Grid
            size={8}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" noWrap component="div">
              LALR Report Generator
            </Typography>
          </Grid>
          <Grid
            size="grow"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DarkModeSwitch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              size={28}
              sunColor="yellow"
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
