import { Box } from "@mui/material";
import { FC } from "react";
import DarkBackground from "../assets/dark-background.jpg";
import LightBackground from "../assets/light-background.jpg";

interface HomeProps {}

const Home: FC<HomeProps> = (props) => {

  const Background = 

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${Background})`,
          height: "100vh",
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
