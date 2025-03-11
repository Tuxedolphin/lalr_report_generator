import React, { useState, useEffect, FC } from "react";
import { MobileStepper, Box, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import GeneralInfoForm from "../../components/Forms/GeneralInfoForm";
import { AcesForm } from "../../components/Forms/AcesInfoForm";
import FirstFootageForm from "../../components/Forms/FirstFootageForm";
import updateBackground from "../../features/updateBackground";
import {
  useNavBarHeightContext,
  useNavBarTextContext,
} from "../../utils/contextFunctions";
import SecondFootageForm from "../../components/Forms/SecondFootageForm";

const AddEntryPage: FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(4);

  updateBackground();

  const setNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;
  setNavBarText("Add Report");
  const navBarHeight = useNavBarHeightContext() as number;

  const handleBack = function () {
    setActiveStep(activeStep - 1);
  };

  const handleNext = function (newActiveStep?: number, newMaxSteps?: number) {
    
    if (activeStep === maxSteps) {
      console.error("Submit function not defined yet")
    }
    
    setActiveStep(newActiveStep ?? activeStep + 1);
    if (newMaxSteps) setMaxSteps(newMaxSteps);
  };

  const commonProps = {
    handleNext: handleNext,
  } as const;

  const stepsContent = {
    generalInfoForm: <GeneralInfoForm {...commonProps} key={0} />,
    acesInfoForm: <AcesForm {...commonProps} key={1} />,
    firstFootageForm: <FirstFootageForm {...commonProps} key={2} />,
    secondFootageForm: <SecondFootageForm{...commonProps} key={3} />,
  } as const;

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
