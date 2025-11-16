// // React imports
// import { FC, useEffect, useState, useRef } from "react";
// import { useTheme, Fade, Box, Grid2 as Grid } from "@mui/material";
// import { Traffic, PhotoCamera } from "@mui/icons-material";
// import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { Dayjs } from "dayjs";

// // Project components
// import Section from "../../../components/Section";
// import JustificationPhotoInput from "../../../components/JustificationPhotoInput";

// // Context & helpers
// import { useReportContext } from "../../../context/contextFunctions";
// import { fadeInAnimationSx, inputSx, alternateGridFormatting } from "../../../utils/constants";
// import { checkForError, generateDynamicJustifications } from "../../../utils/helperFunctions";
// import CroppedPicture from "../../../classes/CroppedPicture";

// // Types
// import { ErrorsType, JustificationInput } from "../../../types/types";

// interface ExtraLRProps {
//   handleNext: (newMaxSteps?: number, newActiveStep?: number, hasError?: boolean) => void;
// }

// export const ExtraLRForm: FC<ExtraLRProps> = ({ handleNext }) => {
//   const theme = useTheme();
//   const [report, updateReport] = useReportContext();
//   const [dynamicJustifications, setDynamicJustifications] = useState<JustificationInput[]>([]);
//   const [errors, setErrors] = useState<ErrorsType>({});
//   const isInitialized = useRef(false);

//   // Initialize justifications from report context or generate new ones
//   useEffect(() => {
//     // First try to use existing justifications from report context
//     const existingJustifications = report.cameraInformation.justifications;

//     if (existingJustifications && existingJustifications.length > 0) {
//       setDynamicJustifications(existingJustifications);
//     } else {
//       // Generate new justifications if none exist
//       const justifications = generateDynamicJustifications(report.generalInformation);
//       setDynamicJustifications(justifications);
//       updateReport.cameraInformation('justifications', justifications);
//     }

//     isInitialized.current = true;
//   }, [report.generalInformation]);

//   // Initialize error state for all inputs
//   useEffect(() => {
//     if (dynamicJustifications.length > 0) {
//       const initialErrors = {} as ErrorsType;

//       dynamicJustifications.forEach((justification) => {
//         // Create error keys for each timing and photo input (2 of each per justification)
//         for (let inputIndex = 0; inputIndex < 2; inputIndex++) {
//           const timingErrorKey = `${justification.id}-timing-${inputIndex}`;
//           const photoErrorKey = `${justification.id}-photo-${inputIndex}`;
//           initialErrors[timingErrorKey] = "";
//           initialErrors[photoErrorKey] = "";
//         }
//       });

//       setErrors(initialErrors);
//     }
//   }, [dynamicJustifications]);

//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();

//     let hasError = false;
//     const newErrors = { ...errors };

//     // Validate all justification inputs
//     dynamicJustifications.forEach((justification) => {
//       for (let inputIndex = 0; inputIndex < 2; inputIndex++) {
//         const timingErrorKey = `${justification.id}-timing-${inputIndex}`;
//         const photoErrorKey = `${justification.id}-photo-${inputIndex}`;

//         // Check if timing is required and missing
//         if (!justification.timings?.[inputIndex]) {
//           newErrors[timingErrorKey] = "This timing is required";
//           hasError = true;
//         }

//         // Check if photo is required and missing
//         if (!justification.photos[inputIndex]) {
//           newErrors[photoErrorKey] = "This photo is required";
//           hasError = true;
//         }
//       }
//     });

//     setErrors(newErrors);
//     handleNext(undefined, undefined, hasError);
//   };

//   // Handle timing changes - directly update report context
//   const handleTimingChange = (justificationIndex: number, timingIndex: number) => (time: Dayjs | null) => {
//     // Update local state
//     setDynamicJustifications(prev => {
//       const updated = [...prev];
//       if (updated[justificationIndex]) {
//         const updatedTimings = [...(updated[justificationIndex].timings || [null, null])];
//         updatedTimings[timingIndex] = time;
//         updated[justificationIndex] = {
//           ...updated[justificationIndex],
//           timings: updatedTimings
//         };

//         // Immediately update report context
//         const newJustifications = [...prev];
//         newJustifications[justificationIndex] = updated[justificationIndex];
//         updateReport.cameraInformation('justifications', newJustifications);

//         // Also persist to database
//         report.updateDBReport('cameraInformation');
//       }
//       return updated;
//     });

//     // Clear timing errors when user inputs data
//     const errorKey = `${dynamicJustifications[justificationIndex]?.id}-timing-${timingIndex}`;
//     setErrors(prev => ({ ...prev, [errorKey]: "" }));
//   };

//   // Handle photo changes - directly update report context
//   const handlePhotoChange = (justificationIndex: number, photoIndex: number) => (photo: CroppedPicture | undefined) => {
//     // Update local state
//     setDynamicJustifications(prev => {
//       const updated = [...prev];
//       if (updated[justificationIndex]) {
//         const updatedPhotos = [...updated[justificationIndex].photos];
//         updatedPhotos[photoIndex] = photo;
//         updated[justificationIndex] = {
//           ...updated[justificationIndex],
//           photos: updatedPhotos
//         };

//         // Immediately update report context
//         const newJustifications = [...prev];
//         newJustifications[justificationIndex] = updated[justificationIndex];
//         updateReport.cameraInformation('justifications', newJustifications);

//         // Also persist to database
//         report.updateDBReport('cameraInformation');
//       }
//       return updated;
//     });

//     // Clear photo errors when user inputs data
//     const errorKey = `${dynamicJustifications[justificationIndex]?.id}-photo-${photoIndex}`;
//     setErrors(prev => ({ ...prev, [errorKey]: "" }));
//   };

//   // Render individual justification timing and photo inputs
//   const renderJustificationInputs = (justification: JustificationInput) => {
//     const inputs: JSX.Element[] = [];

//     // Create 2 timing+photo pairs per justification
//     for (let inputIndex = 0; inputIndex < 2; inputIndex++) {
//       const timingErrorKey = `${justification.id}-timing-${inputIndex}`;
//       const photoErrorKey = `${justification.id}-photo-${inputIndex}`;

//       inputs.push(
//         <Section
//           key={`${justification.id}-input-${inputIndex}`}
//           title={`${justification.reason} #${justification.index + 1} - Input ${inputIndex + 1}`}
//           icon={<PhotoCamera />}
//           accentColor={theme.palette.primary.main}
//           sx={{ mb: 2 }}
//         >
//           {/* Photo Upload */}
//           <Box sx={{ mb: 3 }}>
//             <JustificationPhotoInput
//               photo={justification.photos[inputIndex]}
//               label={`${justification.reason} #${justification.index + 1} Photo ${inputIndex + 1}`}
//               onPhotoChange={handlePhotoChange(justification.index, inputIndex)}
//               error={!!(errors as any)[photoErrorKey]}
//               setErrors={setErrors}
//               errorKey={photoErrorKey}
//             />
//           </Box>

//           {/* Timing Input */}
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <Grid
//               {...alternateGridFormatting.mainGridFormat}
//               sx={{
//                 animation: "fadeIn 0.6s ease-out",
//                 "@keyframes fadeIn": {
//                   "0%": { opacity: 0, transform: "translateY(5px)" },
//                   "100%": { opacity: 1, transform: "translateY(0)" },
//                 },
//               }}
//             >
//               <Grid size={6}>
//                 <TimePicker
//                   label={`${justification.reason} #${justification.index + 1} Timing ${inputIndex + 1}`}
//                   value={justification.timings?.[inputIndex] || null}
//                   onChange={handleTimingChange(justification.index, inputIndex)}
//                   sx={{ ...inputSx(theme.palette.primary.main), width: "100%" }}
//                   views={["hours", "minutes", "seconds"]}
//                   slotProps={{
//                     textField: {
//                       error: !!(errors as any)[timingErrorKey],
//                       helperText: (errors as any)[timingErrorKey],
//                     },
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           </LocalizationProvider>
//         </Section>
//       );
//     }

//     return inputs;
//   };

//   return (
//     <Fade in timeout={500}>
//       <form id="extraLRForm" onSubmit={handleSubmit}>
//           {dynamicJustifications.length > 0 ? (
//             <>
//               {dynamicJustifications.map((justification) => (
//                 <div key={justification.id}>
//                   {renderJustificationInputs(justification)}
//                 </div>
//               ))}
//             </>
//           ) : (
//             <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
//               No justifications configured. Please set up justifications in the previous step.
//             </div>
//           )}
//       </form>
//     </Fade>
//   );
// };

// React imports
import { FC, useEffect, useState, useRef } from "react";
import { useTheme, Fade, Box, Grid2 as Grid, Typography } from "@mui/material";
import { TextField as MuiTextField } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

// Project components
import Section from "../../../components/Section";
import JustificationPhotoInput from "../../../components/JustificationPhotoInput";


// Context & helpers
import { useReportContext } from "../../../context/contextFunctions";
import { inputSx, alternateGridFormatting } from "../../../utils/constants";
import { generateDynamicJustifications } from "../../../utils/helperFunctions";
import CroppedPicture from "../../../classes/CroppedPicture";

// Types
import { ErrorsType, JustificationInput } from "../../../types/types";

interface ExtraLRProps {
    handleNext: (newMaxSteps?: number, newActiveStep?: number, hasError?: boolean) => void;
    justificationIndex: number;
    totalJustifications: number;
}

export const ExtraLRForm: FC<ExtraLRProps> = ({
    handleNext,
    justificationIndex,
    totalJustifications
}) => {
    const theme = useTheme();
    const [report, updateReport] = useReportContext();
    const [currentJustification, setCurrentJustification] = useState<JustificationInput | null>(null);
    const [errors, setErrors] = useState<ErrorsType>({});
    const isInitialized = useRef(false);


    // Initialize or get the current justification
    // useEffect(() => {
    //   let justifications = report.cameraInformation.justifications || [];

    //   // Generate justifications if they don't exist
    //   if (justifications.length === 0) {
    //     justifications = generateDynamicJustifications(report.generalInformation);
    //     updateReport.cameraInformation('justifications', justifications);
    //   }

    //   // Get the specific justification for this form
    //   if (justifications[justificationIndex]) {
    //     setCurrentJustification(justifications[justificationIndex]);
    //   }

    //   isInitialized.current = true;
    // }, [report.generalInformation, justificationIndex]);
    useEffect(() => {
        if (!report) return;

        let justifications = report.cameraInformation.justifications || [];

        // Ensure the array has the required number of justifications
        justifications = generateDynamicJustifications(
            report.generalInformation,
            justifications // pass existing justifications to avoid overwriting
        );

        // Update the report context if we added new justifications
        if (justifications.length !== report.cameraInformation.justifications?.length) {
            updateReport.cameraInformation('justifications', justifications);
        }

        // Set the current justification for this form
        if (justifications[justificationIndex]) {
            setCurrentJustification(justifications[justificationIndex]);
        }

        isInitialized.current = true;
    }, [
        report.generalInformation, // watch for changes in quantities
        justificationIndex,        // watch for navigation between justifications
        report.cameraInformation.justifications // watch for updates
    ]);

    // Initialize error state for this justification's inputs
    useEffect(() => {
        if (currentJustification) {
            const initialErrors = {} as ErrorsType;

            // Create error keys for timing and photo inputs (2 of each per justification)
            for (let inputIndex = 0; inputIndex < 2; inputIndex++) {
                const timingErrorKey = `timing-${inputIndex}`;
                const photoErrorKey = `photo-${inputIndex}`;
                initialErrors[timingErrorKey] = "";
                initialErrors[photoErrorKey] = "";
            }

            setErrors(initialErrors);
        }
    }, [currentJustification]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        console.log('ExtraLRForm handleSubmit called for justification index:', justificationIndex);

        if (!currentJustification) {
            console.log('No current justification, aborting submit');
            handleNext(undefined, undefined, true);
            return;
        }

        console.log('Current justification:', currentJustification);

        let hasError = false;
        const newErrors = { ...errors };

        // Validate this justification's inputs
        for (let inputIndex = 0; inputIndex < 2; inputIndex++) {
            const timingErrorKey = `timing-${inputIndex}`;
            const photoErrorKey = `photo-${inputIndex}`;

            const timing = currentJustification.timings?.[inputIndex];
            const photo = currentJustification.photos[inputIndex];

            console.log(`Validating input ${inputIndex}:`, { timing, photo });

            // Check if timing is required and missing (null is considered missing)
            if (!timing) {
                console.log(`Timing ${inputIndex} is missing`);
                newErrors[timingErrorKey] = "This timing is required";
                hasError = true;
            } else {
                // If timing exists, validate it's a proper Dayjs object
                if (timing && typeof timing === 'object' && 'isValid' in timing) {
                    if (!timing.isValid()) {
                        console.log(`Timing ${inputIndex} is invalid Dayjs object`);
                        newErrors[timingErrorKey] = "Invalid time format";
                        hasError = true;
                    }
                } else {
                    console.log(`Timing ${inputIndex} is not a Dayjs object:`, timing);
                    newErrors[timingErrorKey] = "Invalid time format";
                    hasError = true;
                }
            }

            // Check if photo is required and missing
            if (!photo) {
                console.log(`Photo ${inputIndex} is missing`);
                newErrors[photoErrorKey] = "This photo is required";
                hasError = true;
            }
        }

        console.log('Validation completed. hasError:', hasError, 'newErrors:', newErrors);
        setErrors(newErrors);
        handleNext(undefined, undefined, hasError);
    };

    // Handle timing changes
    const handleTimingChange = (timingIndex: number) => (time: Dayjs | null) => {
        if (!currentJustification) return;

        // Update current justification state
        const updatedTimings = [...(currentJustification.timings || [null, null])];
        updatedTimings[timingIndex] = time;

        const updatedJustification = {
            ...currentJustification,
            timings: updatedTimings
        };

        setCurrentJustification(updatedJustification);

        // Update the justifications array in report context
        const allJustifications = [...(report.cameraInformation.justifications || [])];
        allJustifications[justificationIndex] = updatedJustification;
        updateReport.cameraInformation('justifications', allJustifications);

        // Persist to database
        report.updateDBReport('cameraInformation');

        // Clear timing errors
        const errorKey = `timing-${timingIndex}`;
        setErrors(prev => ({ ...prev, [errorKey]: "" }));
    };

    // Handle photo changes
    const handlePhotoChange = (photoIndex: number) => (photo: CroppedPicture | undefined) => {
        if (!currentJustification) return;

        // Update current justification state
        const updatedPhotos = [...currentJustification.photos];
        updatedPhotos[photoIndex] = photo;

        const updatedJustification = {
            ...currentJustification,
            photos: updatedPhotos
        };

        setCurrentJustification(updatedJustification);

        // Update the justifications array in report context
        const allJustifications = [...(report.cameraInformation.justifications || [])];
        allJustifications[justificationIndex] = updatedJustification;
        updateReport.cameraInformation('justifications', allJustifications);

        // Persist to database
        report.updateDBReport('cameraInformation');

        // Clear photo errors
        const errorKey = `photo-${photoIndex}`;
        setErrors(prev => ({ ...prev, [errorKey]: "" }));
    };

    // Render the inputs for this specific justification
    const renderJustificationInputs = () => {
        if (!currentJustification) return null;

        const inputs: JSX.Element[] = [];

        // Create 2 timing+photo pairs for this justification
        for (let inputIndex = 0; inputIndex < 2; inputIndex++) {
            const timingErrorKey = `timing-${inputIndex}`;
            const photoErrorKey = `photo-${inputIndex}`;

            inputs.push(
                <Section
                    key={`input-${inputIndex}`}
                    title={`${currentJustification.reason} - Input ${inputIndex + 1}`}
                    icon={<PhotoCamera />}
                    accentColor={theme.palette.primary.main}
                    sx={{ mb: 3 }}
                >
                    {/* Photo Upload */}
                    <Box sx={{ mb: 3 }}>
                        <JustificationPhotoInput
                            photo={currentJustification.photos[inputIndex]}
                            label={`${currentJustification.reason} Photo ${inputIndex + 1}`}
                            onPhotoChange={handlePhotoChange(inputIndex)}
                            error={!!errors[photoErrorKey]}
                            setErrors={setErrors}
                            errorKey={photoErrorKey}
                        />
                    </Box>

                    {/* Timing Input */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid
                            {...alternateGridFormatting.mainGridFormat}
                            sx={{
                                animation: "fadeIn 0.6s ease-out",
                                "@keyframes fadeIn": {
                                    "0%": { opacity: 0, transform: "translateY(5px)" },
                                    "100%": { opacity: 1, transform: "translateY(0)" },
                                },
                            }}
                        >
                            <Grid size={6}>
                                <TimePicker
                                    label={`${currentJustification.reason} Timing ${inputIndex + 1}`}
                                    value={currentJustification.timings?.[inputIndex] || null}
                                    onChange={handleTimingChange(inputIndex)}
                                    sx={{ ...inputSx(theme.palette.primary.main), width: "100%" }}
                                    views={["hours", "minutes", "seconds"]}
                                    slotProps={{
                                        textField: {
                                            error: !!errors[timingErrorKey],
                                            helperText: errors[timingErrorKey],
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </Section>
            );
        }

        return inputs;
    };

    if (!currentJustification) {
        return (
            <Fade in timeout={500}>
                <Box sx={{ textAlign: 'center', padding: '2rem' }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        Loading justification {justificationIndex + 1}...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Form {justificationIndex + 1} of {totalJustifications}
                    </Typography>
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in timeout={500}>
            <form id={`extraLRForm-${justificationIndex}`} onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h6"
                        color="primary"
                        sx={{
                            textAlign: 'center',
                            mb: 2,
                            fontWeight: 600
                        }}
                    >
                        {currentJustification.reason} - Form {justificationIndex + 1} of {totalJustifications}
                    </Typography>
                    {renderJustificationInputs()}
                </Box>
                <Section
                    title="Remarks (e.g 1st SFTL - Yishun Ave 8/Yishun Ave 2)"
                    accentColor={theme.palette.primary.main}
                    sx={{ mt: 3 }}
                >
                    <MuiTextField
                        label="Location of Delay"
                        variant="outlined"
                        fullWidth
                        value={currentJustification.remarks}
                        onChange={(e) => {
                            const updatedJustification = {
                                ...currentJustification,
                                remarks: e.target.value
                            };

                            setCurrentJustification(updatedJustification);

                            // Update the justifications array in report context
                            const allJustifications = [...(report.cameraInformation.justifications || [])];
                            allJustifications[justificationIndex] = updatedJustification;
                            updateReport.cameraInformation('justifications', allJustifications);

                            // Persist to database
                            report.updateDBReport('cameraInformation');
                        }}
                        multiline
                        rows={2}
                        sx={{
                            mt: 2,
                            ...inputSx(theme.palette.primary.main) // Use your existing styling
                        }}
                        error={!!errors.remarks}
                        helperText={errors.remarks || ""}
                    />
                </Section>
            </form>
        </Fade>
    );
};
