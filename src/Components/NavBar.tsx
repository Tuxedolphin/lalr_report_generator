import { AppBar, Toolbar, Typography, useScrollTrigger } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FC, useEffect, useRef, RefObject, cloneElement } from "react";
import { DarkModeSwitch } from "animated-toggle-button";
import {
  useIsDarkModeContext,
  useNavBarHeightContext,
  useNavBarTextContext,
} from "../context/contextFunctions";

interface ElevationType {
  children: React.ReactElement<{ elevation?: number; sx?: object }>;
}

const ElevationScroll: FC<ElevationType> = function ({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
  });

  const elevation = trigger ? 4 : 0;

  return cloneElement(children, {
    elevation: elevation,
  });
};

const NavBar: FC = function () {
  const [isDarkMode, toggleDarkMode] = useIsDarkModeContext(true) as [
    boolean,
    () => void,
  ];

  const text = useNavBarTextContext(true) as string;

  const setHeight = useNavBarHeightContext(true) as React.Dispatch<
    React.SetStateAction<number>
  >;
  const ref = useRef() as RefObject<HTMLDivElement>;

  useEffect(() => {
    if (!ref.current) return;

    setHeight(ref.current.clientHeight);
  });

  return (
    <ElevationScroll>
      <AppBar
        sx={{
          position: "sticky",
        }}
      >
        <Toolbar ref={ref}>
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
