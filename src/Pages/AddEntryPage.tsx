import { useState, FC } from "react";
import {
  TextField,
  Typography,
  Divider,
  MobileStepper,
  FormLabel,
  Theme,
  Box,
  Paper,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const AddEntryPage: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = 3;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper elevation={1} square={false}>
        <Paper
          square
          elevation={2}
          sx={{
            display: "flex",
            alignItems: "center",
            height: 75,
            pl: 2,
          }}
        >
          <Typography variant="h5">General Information</Typography>
        </Paper>
        <Box sx={{ height: "78vh", width: "100%", p: 2 }}>
          <TextField
            id="incNumber"
            label="Incident Number"
            variant="outlined"
            fullWidth
          />
        </Box>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Paper>
    </Box>
  );
};

export default AddEntryPage;
