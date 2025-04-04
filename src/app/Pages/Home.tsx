import { Box, Button, Typography } from "@mui/material";
import { KeyboardArrowRight, History } from "@mui/icons-material";
import { FC, useEffect } from "react";
import {
  useIsDarkModeContext,
  useNavBarHeightContext,
  useNavBarTextContext,
} from "../../context/contextFunctions";
import DarkBackground from "../../assets/dark-background.jpg";
import LightBackground from "../../assets/light-background.jpg";
import updateBackground from "../../features/updateBackground";
import { Link } from "react-router-dom";
import ls from "../../features/LocalStorage";

const Home: FC = function () {
  updateBackground(useIsDarkModeContext() ? DarkBackground : LightBackground);

  const NavHeight = useNavBarHeightContext() as number;
  const updateNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;

  useEffect(() => {
    updateNavBarText("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = () => {
    ls.clear();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "column",
          padding: "5%",

          minHeight: `calc(100vh - ${NavHeight.toString()}px)`,
        }}
      >
        <Box>
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "400",
              fontSize: "5em",
              lineHeight: "1em",
            }}
          >
            LALR Generator
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "space-evenly",
            gap: "25px",
          }}
        >
          <Link style={{ textAlign: "center", width: "100%" }} to="/add_entry">
            <Button
              size="large"
              variant="contained"
              sx={{ width: "90%" }}
              endIcon={<KeyboardArrowRight />}
              onClick={onClick}
            >
              Get Started
            </Button>
          </Link>
          <Link style={{ textAlign: "center", width: "100%" }} to="/history">
            <Button
              size="large"
              variant="outlined"
              sx={{ width: "90%" }}
              endIcon={<History />}
            >
              History
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Home;
