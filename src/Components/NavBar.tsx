import {
  AppBar,
  Toolbar,
  Typography,
  useScrollTrigger,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { FC, useEffect, useRef, RefObject } from "react";
import { DarkModeSwitch } from "animated-toggle-button";
import {
  useIsDarkModeContext,
  useNavBarHeightContext,
} from "../utils/contextFunctions";

// interface ElevationType {
//   children: React.ReactElement<{ elevation?: number; sx?: object }>;
// }

// const ElevationScroll: FC<ElevationType> = function ({ children }) {
//   const trigger = useScrollTrigger({
//     disableHysteresis: true,
//   });

//   const format = trigger
//     ? ([4, "primary"] as const)
//     : ([0, "transparent"] as const); // format[0] is the height, format[1] is the background colour

//   return React.cloneElement(children, {
//     elevation: format[0],
//     sx: { background: format[1], boxShadow: "none" },
//   });
// };

interface NavProps {
  text: string;
}

const NavBar: FC<NavProps> = function ({ text }) {
  const [isDarkMode, toggleDarkMode] = useIsDarkModeContext(true) as [
    boolean,
    () => void,
  ];

  const setHeight = useNavBarHeightContext(true) as React.Dispatch<
    React.SetStateAction<number>
  >;
  const ref = useRef() as RefObject<HTMLDivElement>;

  useEffect(() => {
    if (!ref.current) return;

    setHeight(ref.current.clientHeight);
  });

  return (
    <>
      <AppBar
        sx={{
          background: "transparent",
          boxShadow: "none",
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
    </>
  );
};

export default NavBar;
