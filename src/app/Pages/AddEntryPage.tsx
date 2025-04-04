// React and React Router imports
import React, { useState, FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Material UI imports
import { MobileStepper, Box, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

// Local component imports
import IncidentInfoForm from "./forms/IncidentInfoForm";
import { AcesForm } from "./forms/AcesInfoForm";
import FirstFootageForm from "./forms/FirstFootageForm";
import SecondFootageForm from "./forms/SecondFootageForm";

// Features and utils
import updateBackground from "../../features/updateBackground";
import generateReportPpt from "../../features/generateReport/generateReport";
import ls from "../../features/LocalStorage";
import { retrieveReport } from "../../features/db";

// Context hooks
import {
  useNavBarHeightContext,
  useNavBarTextContext,
  useReportContext,
} from "../../context/contextFunctions";

const AddEntryPage: FC = function () {
  const [report, updateReport] = useReportContext();
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(4);
  const navigate = useNavigate();
  const setNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;
  const navBarHeight = useNavBarHeightContext() as number;
  const buttonWidth = "77.5px";

  // Update background on component render
  updateBackground();

  useEffect(() => {
    setNavBarText("Add Report");

    const id = ls.getWorkingOn();

    if (id < 0) return;

    retrieveReport(id)
      .then((report) => {
        updateReport.all(report);
      })
      .catch(console.error);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = function () {
    setActiveStep(activeStep - 1);
  };

  const handleNext = function (newMaxSteps?: number, newActiveStep?: number) {
    if (activeStep === maxSteps - 1) {
      // Updating to make sure that the DB report is saved correctly
      report.updateDBReport();

      generateReportPpt(report).catch(console.error);
      ls.clear();

      navigate("/history");
    } else {
      setActiveStep(newActiveStep ?? activeStep + 1);
      if (newMaxSteps) setMaxSteps(newMaxSteps);
    }
  };

  const commonProps = {
    handleNext: handleNext,
  } as const;

  const stepsContent = {
    generalInfoForm: <IncidentInfoForm {...commonProps} key={0} />,
    acesInfoForm: <AcesForm {...commonProps} key={1} />,
    firstFootageForm: <FirstFootageForm {...commonProps} key={3} />,
    secondFootageForm: <SecondFootageForm {...commonProps} key={4} />,
  } as const;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: `calc(100vh - ${navBarHeight.toString()}px)`,
      }}
    >
      <Box
        sx={{
          width: "100%",
          p: 1,
          flexGrow: 2,
        }}
      >
        {Object.values(stepsContent)[activeStep]}
      </Box>
      <MobileStepper
        variant="progress"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            form={Object.keys(stepsContent)[activeStep]}
            type="submit"
            sx={{ width: buttonWidth }}
          >
            {activeStep === maxSteps - 1 ? "Submit" : "Next"}
            {activeStep !== maxSteps - 1 && <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default AddEntryPage;
