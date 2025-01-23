import { Box } from "@mui/material";
import { FC } from "react";
import { useIsDarkModeContext } from "../../utils/contextFunctions";
import DarkBackground from "../../assets/dark-background.jpg"
import LightBackground from "../../assets/light-background.jpg";

interface HomeProps {}

const Home: FC<HomeProps> = (props) => {

  const Background = useIsDarkModeContext() ? DarkBackground : LightBackground;

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${Background})`,
          height: "150vh",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {" "}
        test{" "}
      </Box>
    </>
  );
};

export default Home;
