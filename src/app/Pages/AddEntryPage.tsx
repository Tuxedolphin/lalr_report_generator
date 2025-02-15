import React, { useState, useEffect, FC } from "react";
import { MobileStepper, Box, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import GeneralInfoForm from "../../components/Forms/GeneralInfoForm";
import { AcesForm } from "../../components/Forms/AcesInfoForm";
import FootageForm from "../../components/Forms/FootageForm";
import updateBackground from "../../features/updateBackground";
import {
  useNavBarHeightContext,
  useNavBarTextContext,
} from "../../utils/contextFunctions";

const AddEntryPage: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(4);

  updateBackground();

  const setNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;
  setNavBarText("Add Report");
  const navBarHeight = useNavBarHeightContext() as number;

  const commonProps = {
    setActiveStep: setActiveStep,
  } as const;

  const stepsContent = {
    generalInfoForm: <GeneralInfoForm {...commonProps} key={0} />,
    acesInfoForm: <AcesForm {...commonProps} key={1} />,
    footageForm: <FootageForm {...commonProps} key={2} />,
  } as const;

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: `calc(100vh - ${navBarHeight.toString()}px)`,
      }}
    >
      <Box sx={{ width: "100%", p: 1, flexGrow: 2 }}>
        {Object.values(stepsContent)[activeStep]}
      </Box>
      <MobileStepper
        variant="progress"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            form={Object.keys(stepsContent)[activeStep]}
            type="submit"
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
