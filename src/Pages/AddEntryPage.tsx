import React, { useState, useEffect, FC } from "react";
import { MobileStepper, Box, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import FirstPageForm from "../Components/FirstPageForm";
import { AcesForm } from "../Components/AcesForm";
import LRAcesForm from "../Components/LRAcesForm";
import AddPhotosForm from "../Components/AddPhotosForm";

const mainGridFormat = {
  container: true,
  spacing: { xs: 2, md: 3 },
  columns: { xs: 4, sm: 8, md: 12 },
};

const smallInput = {
  xs: 2,
  sm: 4,
  md: 4,
};

const largeInput = {
  xs: 4,
  sm: 8,
  md: 8,
};

interface AddEntryPageProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const AddEntryPage: FC<AddEntryPageProps> = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(4);
  const [isLA, setIsLA] = useState<boolean | null>(null);
  const [opsCenterAcknowledge, setOpsCenterAcknowledge] = useState<
    boolean | null
  >(null);

  props.setText("Add Incident");

  const stepsContent = [
    <FirstPageForm key={0} />,
    <AcesForm
      isLA={isLA}
      opsCenterAcknowledge={opsCenterAcknowledge}
      setText={props.setText}
      key={1}
    />,
    <LRAcesForm key={2} />,
    <AddPhotosForm isLA={isLA} key={3} />,
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      <Box sx={{ width: "100%", p: 1, flexGrow: 2 }}>
        {stepsContent[activeStep]}
      </Box>
      <MobileStepper
        variant="progress"
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
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default AddEntryPage;
