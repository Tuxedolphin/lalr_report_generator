import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FC } from "react";
import { DarkModeSwitch } from "animated-toggle-button";

interface NavProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
}

const NavBar: FC<NavProps> = (props) => {
  const { isDarkMode, setIsDarkMode, text } = props;

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  return (
    <AppBar position="sticky" sx={{height: 56}}>
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
              {text}
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
