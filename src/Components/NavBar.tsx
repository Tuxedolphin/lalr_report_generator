import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useScrollTrigger,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { FC, useEffect, useRef } from "react";
import { DarkModeSwitch } from "animated-toggle-button";
import { useIsDarkModeContext } from "../utils/contextFunctions";

interface ElevationType {
  children: React.ReactElement<{ elevation?: number; sx?: object }>;
}

const ElevationScroll: FC<ElevationType> = function ({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,

  });

  const format = trigger ? [4, "primary"] as const : [0, "transparent"] as const; // format[0] is the height, format[1] is the background colour

  return React.cloneElement(children, {
    elevation: format[0],
    sx: { background: format[1], boxShadow: "none" },
  });
};

interface NavProps {
  text: string;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
}

const NavBar: FC<NavProps> = function (props) {
  const { text, setHeight } = props;

  const [isDarkMode, toggleDarkMode] = useIsDarkModeContext(true) as [
    boolean,
    () => void,
  ];

  // TODO: Check if this part is still needed with sticky app bar gone
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    } else {
      throw Error("Current Ref has no target on page load");
    }
  });

  return (
    <ElevationScroll>
      <AppBar ref={ref}>
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
    </ElevationScroll>
  );
};

export default NavBar;
