import { Box, Button, Typography } from "@mui/material";
import { KeyboardArrowRight, History } from "@mui/icons-material";
import { FC } from "react";
import { useIsDarkModeContext } from "../../utils/contextFunctions";
import DarkBackground from "../../assets/dark-background.jpg";
import LightBackground from "../../assets/light-background.jpg";
import { Link } from "react-router-dom";

interface HomeProps {}

const Home: FC<HomeProps> = (props) => {
  const Background = useIsDarkModeContext() ? DarkBackground : LightBackground;

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${Background})`,
          height: "100vh",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",

          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "column",

          padding: "5%",
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
            LALR Report Generator
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "space-evenly",
            gap: "25px"
          }}
        >
          <Link style={{ textAlign: "center", width: "100%" }} to="/add_entry">
            <Button
              size="large"
              variant="contained"
              sx={{ width: "90%" }}
              endIcon={<KeyboardArrowRight />}
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
