import React, { useState, useEffect, FC } from "react";
import { MobileStepper, Box, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import GeneralInfoForm from "../../components/GeneralInfoForm";
import { AcesForm } from "../../components/AcesForm";
import FootageForm from "../../components/FootageForm";
import AddPhotosButton from "../../components/AddPhotosButton";
import { Report } from "../../classes/Report";
import {
  type ReportValueTypes,
  type ReportValueKeysType,
  type IncidentInformationType,
} from "../../types/types.tsx";

interface AddEntryPageProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  isDarkMode: boolean;
  reportEntry: Report;
  setReportEntry: React.Dispatch<React.SetStateAction<Report>>;
  navBarHeight: number;
}

const AddEntryPage: FC<AddEntryPageProps> = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(4);

  const { setText, isDarkMode, reportEntry, setReportEntry, navBarHeight } =
    props;

  setText("Add Incident");

  // TODO: Update function
  const updateEntry = (edits: MultipleInputEditsType) => {
    console.log(edits);
    setReportEntry(Report.updateNewReport(reportEntry, edits));
  };

  const commonProps = {
    reportEntry: reportEntry,
    updateEntry: updateEntry,
    setActiveStep: setActiveStep,
    isDarkMode: isDarkMode,
    setText: setText,
  } as const;

  const stepsContent = {
    "general-info-form": <GeneralInfoForm {...commonProps} key={0} />,
    "aces-form": <AcesForm {...commonProps} key={1} />,
    "footage-form": <FootageForm {...commonProps} key={2} />,
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
