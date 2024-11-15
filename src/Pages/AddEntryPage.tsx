import React, { useState, useEffect, FC } from "react";
import { MobileStepper, Box, Button } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import GeneralInfoForm from "../Components/GeneralInfoForm";
import { AcesForm } from "../Components/AcesForm";
import FootageForm from "../Components/FootageForm";
import AddPhotosButton from "../Components/AddPhotosButton";
import {
  Report,
  type EditsType,
  type MultipleInputEditsType,
  type ReportValueTypes,
  type ReportValueKeysType,
  type IncidentInformationType,
  type LRInformationKeyType,
  type LAInformationKeyType,
} from "../Classes/Report";

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
  };

  const stepsContent = {
    "general-info-form": <GeneralInfoForm {...commonProps} key={0} />,
    "aces-form": <AcesForm {...commonProps} key={1} />,
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
