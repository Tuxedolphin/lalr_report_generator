import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FC, useEffect, useRef } from "react";
import { DarkModeSwitch } from "animated-toggle-button";

interface NavProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

const NavBar: FC<NavProps> = (props) => {
  const { isDarkMode, setIsDarkMode, text, setHeight } = props;

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    } else {
      throw Error("Current Ref has no target on page load");
    }
  });

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  return (
    <AppBar position="sticky" ref={ref}>
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
