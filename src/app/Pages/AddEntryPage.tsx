// // React and React Router imports
// import React, { useState, FC, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// // Material UI imports
// import {
//   Box,
//   Button,
//   alpha,
//   useTheme,
//   Paper,
//   Fade,
//   MobileStepper,
//   Alert,
//   Collapse,
// } from "@mui/material";
// import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

// // Local component imports
// import IncidentInfoForm from "./forms/IncidentInfoForm";
// import { AcesForm } from "./forms/AcesInfoForm";
// import FirstFootageForm from "./forms/FirstFootageForm";
// import SecondFootageForm from "./forms/SecondFootageForm";
// import Report from "../../classes/Report";

// // Features and utils
// import generateReportPpt from "../../features/generateReport/generateReport";
// import ls from "../../features/LocalStorage";
// import { retrieveReport } from "../../features/db";

// // Context hooks
// import {
//   useNavBarHeightContext,
//   useNavBarTextContext,
//   useReportContext,
// } from "../../context/contextFunctions";
// import { ReportGenerationStatusType } from "../../types/types";
// import { ExtraLRForm } from "./forms/ExtraLRInfoForm";

// interface AddEntryPageProps {
//   setGeneratingReport: React.Dispatch<
//     React.SetStateAction<ReportGenerationStatusType>
//   >;
// }

// const AddEntryPage: FC<AddEntryPageProps> = function ({ setGeneratingReport }) {
//   const [report, updateReport] = useReportContext();
//   const [activeStep, setActiveStep] = useState(0);
//   const [maxSteps, setMaxSteps] = useState(5);
//   const [showError, setShowError] = useState(false);
//   const navigate = useNavigate();
//   const setNavBarText = useNavBarTextContext() as React.Dispatch<
//     React.SetStateAction<string>
//   >;
//   const navBarHeight = useNavBarHeightContext() as number;
//   const theme = useTheme();

//   useEffect(() => {
//     setNavBarText("Add Report");

//     const id = ls.getWorkingOn();

//     if (id === undefined) {
//       updateReport.all(new Report());
//       return;
//     }
//     if (id < 0) return;

//     retrieveReport(id)
//       .then((report) => {
//         updateReport.all(report);
//       })
//       .catch(console.error);

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Function to scroll to the top of the page
//   const scrollToTop = () => {
//     // Using window.scrollTo is more reliable for this use case
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   useEffect(() => {
//     // Scroll to top when step changes
//     scrollToTop();
//     setShowError(false);
//   }, [activeStep]);

//   const handleBack = function () {
//     setActiveStep(activeStep - 1);
//   };

//   const handleNext = function (
//     newMaxSteps?: number,
//     newActiveStep?: number,
//     hasError?: boolean
//   ) {
//     if (hasError) {
//       setShowError(true);

//       setTimeout(() => {
//         setShowError(false);
//       }, 10000);
//       scrollToTop();
//       return;
//     }

//     // Clear any previous errors
//     setShowError(false);

//     if (activeStep === maxSteps - 1) {
//       // Updating to make sure that the DB report is saved correctly
//       report.updateDBReport();

//       generateReportPpt(report)
//         .then(() => {
//           setGeneratingReport("complete");
//         })
//         .catch((error: unknown) => {
//           console.error(error);
//           setGeneratingReport("error");
//         });
//       ls.clearWorkingOn();

//       setGeneratingReport("inProgress");
//       navigate("/download");
//     } else {
//       setActiveStep(newActiveStep ?? activeStep + 1);
//       if (newMaxSteps) setMaxSteps(newMaxSteps);
//     }
//   };

//   const commonProps = {
//     handleNext: handleNext,
//   } as const;

//   const getStepsContent = () => {
//     const isLR = report.incidentInformation.reportType === "LR";
//     const isNotAcknowledged = !report.incidentInformation.opsCenterAcknowledged;

//     if (isLR && isNotAcknowledged) {
//       return {
//         generalInfoForm: <IncidentInfoForm {...commonProps} key={0} />,
//         acesInfoForm: <AcesForm {...commonProps} key={1} />,
//         firstFootageForm: <FirstFootageForm {...commonProps} key={2} />,
//         extraLRForm: <ExtraLRForm {...commonProps} key={3} />,
//         secondFootageForm: <SecondFootageForm {...commonProps} key={4} />,
//       } as const;
//     }

//     return {
//       generalInfoForm: <IncidentInfoForm {...commonProps} key={0} />,
//       acesInfoForm: <AcesForm {...commonProps} key={1} />,
//       firstFootageForm: <FirstFootageForm {...commonProps} key={2} />,
//       secondFootageForm: <SecondFootageForm {...commonProps} key={3} />,
//     } as const;
//   };

//   // Replace the static stepsContent with the dynamic version
//   const stepsContent = getStepsContent();

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           minHeight: `calc(100vh - ${navBarHeight.toString()}px)`,
//           px: { xs: 1.5, sm: 2 },
//           pt: 2,
//           pb: 2,
//           background: alpha(theme.palette.background.default, 0.5),
//           position: "relative",
//         }}
//       >
//         {/* Error Alert */}
//         <Collapse in={showError}>
//           <Alert
//             severity="error"
//             sx={{ mb: 2 }}
//             onClose={() => {
//               setShowError(false);
//             }}
//           >
//             Please resolve all validation issues before proceeding.
//           </Alert>
//         </Collapse>

//         <Box
//           sx={{
//             width: "100%",
//             flexGrow: 1,
//             mb: 2,
//             overflow: "auto",
//           }}
//         >
//           <Fade in={true} timeout={400}>
//             <Box>{Object.values(stepsContent)[activeStep]}</Box>
//           </Fade>
//         </Box>
//       </Box>
//       <Paper
//         elevation={3}
//         sx={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1000,
//         }}
//       >
//         <MobileStepper
//           variant="progress"
//           steps={maxSteps}
//           position="static"
//           activeStep={activeStep}
//           sx={{
//             background: alpha(theme.palette.background.paper, 0.95),
//             backdropFilter: "blur(10px)",
//             "& .MuiLinearProgress-root": {
//               width: "100%",
//               height: 6,
//               borderRadius: 3,
//             },
//             "& .MuiLinearProgress-bar": {
//               borderRadius: 3,
//             },
//           }}
//           nextButton={
//             <Button
//               form={Object.keys(stepsContent)[activeStep]}
//               type="submit"
//               size="small"
//               sx={{
//                 fontWeight: 500,
//                 minWidth: 80,
//                 paddingRight: 0,
//                 marginLeft: 2,
//               }}
//             >
//               {activeStep === maxSteps - 1 ? "Submit" : "Next"}
//               {activeStep !== maxSteps - 1 && <KeyboardArrowRight />}
//             </Button>
//           }
//           backButton={
//             <Button
//               size="small"
//               onClick={handleBack}
//               disabled={activeStep === 0}
//               sx={{
//                 fontWeight: 500,
//                 minWidth: 80,
//                 paddingLeft: 0,
//                 marginRight: 2,
//               }}
//             >
//               <KeyboardArrowLeft />
//               Back
//             </Button>
//           }
//         />
//       </Paper>
//     </>
//   );
// };

// export default AddEntryPage;

// React and React Router imports
import React, { useState, FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Material UI imports
import {
  Box,
  Button,
  alpha,
  useTheme,
  Paper,
  Fade,
  MobileStepper,
  Alert,
  Collapse,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

// Local component imports
import IncidentInfoForm from "./forms/IncidentInfoForm";
import { AcesForm } from "./forms/AcesInfoForm";
import FirstFootageForm from "./forms/FirstFootageForm";
import SecondFootageForm from "./forms/SecondFootageForm";
import Report from "../../classes/Report";

// Features and utils
import generateReportPpt from "../../features/generateReport/generateReport";
import ls from "../../features/LocalStorage";
import { retrieveReport } from "../../features/db";

// Context hooks
import {
  useNavBarHeightContext,
  useNavBarTextContext,
  useReportContext,
} from "../../context/contextFunctions";
import { ReportGenerationStatusType } from "../../types/types";
import { ExtraLRForm } from "./forms/ExtraLRInfoForm";

interface AddEntryPageProps {
  setGeneratingReport: React.Dispatch<
    React.SetStateAction<ReportGenerationStatusType>
  >;
}

const AddEntryPage: FC<AddEntryPageProps> = function ({ setGeneratingReport }) {
  const [report, updateReport] = useReportContext();
  const [activeStep, setActiveStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(5);
  const [showError, setShowError] = useState(false);
  const [dynamicLRSteps, setDynamicLRSteps] = useState<number>(0); // Track number of LR steps
  const navigate = useNavigate();
  const setNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;
  const navBarHeight = useNavBarHeightContext() as number;
  const theme = useTheme();

  useEffect(() => {
    setNavBarText("Add Report");

    const id = ls.getWorkingOn();

    if (id === undefined) {
      updateReport.all(new Report());
      return;
    }
    if (id < 0) return;

    retrieveReport(id)
      .then((report) => {
        updateReport.all(report);
      })
      .catch(console.error);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate dynamic steps based on LR justification quantities
  useEffect(() => {
    const isLR = report.incidentInformation.reportType === "LR";
    const isNotAcknowledged = !report.incidentInformation.opsCenterAcknowledged;
    
    if (isLR && isNotAcknowledged) {
      // Calculate total quantity from all LR justification types
      const generalInfo = report.generalInformation;
      const totalQuantity = 
        (generalInfo.sftl?.quantity || 0) +
        (generalInfo.trafficCongestion?.quantity || 0) +
        (generalInfo.inclementWeather?.quantity || 0) +
        (generalInfo.acesRouteDeviation?.quantity || 0);
      
      // Each form handles 1 justification item (2 inputs per item)
      const numberOfLRForms = Math.max(totalQuantity, 1); // At least 1 form if LR
      setDynamicLRSteps(numberOfLRForms);
      setMaxSteps(4 + numberOfLRForms); // Base steps (4) + dynamic LR forms
    } else {
      setDynamicLRSteps(0);
      setMaxSteps(4); // Standard flow without LR forms
    }
  }, [
    report.incidentInformation.reportType, 
    report.incidentInformation.opsCenterAcknowledged, 
    report.generalInformation.sftl?.quantity,
    report.generalInformation.trafficCongestion?.quantity,
    report.generalInformation.inclementWeather?.quantity,
    report.generalInformation.acesRouteDeviation?.quantity
  ]);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToTop();
    setShowError(false);
  }, [activeStep]);

  const handleBack = function () {
    setActiveStep(activeStep - 1);
  };

  const handleNext = function (
    newMaxSteps?: number,
    newActiveStep?: number,
    hasError?: boolean
  ) {
    if (hasError) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 10000);
      scrollToTop();
      return;
    }

    setShowError(false);

    if (activeStep === maxSteps - 1) {
      report.updateDBReport();

      generateReportPpt(report)
        .then(() => {
          setGeneratingReport("complete");
        })
        .catch((error: unknown) => {
          console.error(error);
          setGeneratingReport("error");
        });
      ls.clearWorkingOn();

      setGeneratingReport("inProgress");
      navigate("/download");
    } else {
      setActiveStep(newActiveStep ?? activeStep + 1);
      if (newMaxSteps) setMaxSteps(newMaxSteps);
    }
  };

  const commonProps = {
    handleNext: handleNext,
  } as const;

  // Generate step content dynamically
  const getStepContent = (step: number) => {
    const isLR = report.incidentInformation.reportType === "LR";
    const isNotAcknowledged = !report.incidentInformation.opsCenterAcknowledged;

    console.log('Getting step content for step:', step, 'isLR:', isLR, 'isNotAcknowledged:', isNotAcknowledged, 'dynamicLRSteps:', dynamicLRSteps);

    // Base steps
    if (step === 0) return <IncidentInfoForm {...commonProps} key={step} />;
    if (step === 1) return <AcesForm {...commonProps} key={step} />;
    if (step === 2) return <FirstFootageForm {...commonProps} key={step} />;

    // Dynamic LR steps (if applicable)
    if (isLR && isNotAcknowledged && step >= 3 && step < 3 + dynamicLRSteps) {
      const justificationIndex = step - 3; // 0-based index for justifications
      console.log('Rendering ExtraLRForm for justificationIndex:', justificationIndex);
      return (
        <ExtraLRForm 
          {...commonProps} 
          key={step} 
          justificationIndex={justificationIndex}
          totalJustifications={dynamicLRSteps}
        />
      );
    }

    // Final step (SecondFootageForm)
    console.log('Rendering SecondFootageForm for step:', step);
    return <SecondFootageForm {...commonProps} key={step} />;
  };

  // Generate form ID for the current step
  const getFormId = (step: number) => {
    const isLR = report.incidentInformation.reportType === "LR";
    const isNotAcknowledged = !report.incidentInformation.opsCenterAcknowledged;

    if (step === 0) return "generalInfoForm";
    if (step === 1) return "acesInfoForm";
    if (step === 2) return "firstFootageForm";
    
    if (isLR && isNotAcknowledged && step >= 3 && step < 3 + dynamicLRSteps) {
      return `extraLRForm-${step - 3}`;
    }
    
    return "secondFootageForm";
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: `calc(100vh - ${navBarHeight.toString()}px)`,
          px: { xs: 1.5, sm: 2 },
          pt: 2,
          pb: 2,
          background: alpha(theme.palette.background.default, 0.5),
          position: "relative",
        }}
      >
        <Collapse in={showError}>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => {
              setShowError(false);
            }}
          >
            Please resolve all validation issues before proceeding.
          </Alert>
        </Collapse>

        <Box
          sx={{
            width: "100%",
            flexGrow: 1,
            mb: 2,
            overflow: "auto",
          }}
        >
          <Fade in={true} timeout={400}>
            <Box>{getStepContent(activeStep)}</Box>
          </Fade>
        </Box>
      </Box>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <MobileStepper
          variant="progress"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(10px)",
            "& .MuiLinearProgress-root": {
              width: "100%",
              height: 6,
              borderRadius: 3,
            },
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
            },
          }}
          nextButton={
            <Button
              form={getFormId(activeStep)}
              type="submit"
              size="small"
              sx={{
                fontWeight: 500,
                minWidth: 80,
                paddingRight: 0,
                marginLeft: 2,
              }}
            >
              {activeStep === maxSteps - 1 ? "Submit" : "Next"}
              {activeStep !== maxSteps - 1 && <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{
                fontWeight: 500,
                minWidth: 80,
                paddingLeft: 0,
                marginRight: 2,
              }}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Paper>
    </>
  );
};

export default AddEntryPage;