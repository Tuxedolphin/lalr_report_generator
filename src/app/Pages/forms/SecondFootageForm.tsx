// React imports
import { FC, useEffect, useRef, useState } from "react";

// MUI components
import {
  alpha,
  Box,
  Fade,
  FormControl,
  Grid2 as Grid,
  InputAdornment,
  Stack,
  TextField as MuiTextField,
  Typography,
  useTheme,
} from "@mui/material";

// MUI icons
import {
  FireTruck,
  HourglassTop,
  LocationOn,
  Notes,
} from "@mui/icons-material";

// Project context
import { useReportContext } from "../../../context/contextFunctions";

// Project classes
import Report from "../../../classes/Report";
import Time from "../../../classes/Time";

// Project components
import Section from "../../../components/Section";
import TextField from "../../../components/TextField";
import TimeLengthPicker from "../../../components/TimeLengthPicker";
import TimingAndPhotoInput from "../../../components/TimingAndPhotoInput";
import ToggleButtonInputType from "../../../components/ToggleButtonInputType";

// Project constants
import {
  alternateGridFormatting,
  timingInputToPhoto,
} from "../../../utils/constants";
import { defaultJustification } from "../../../features/generateReport/utils/constants";

// Project types
import {
  ErrorsType,
  SetErrorsType,
  UpdateReportType,
} from "../../../types/types";

// Utility functions
import {
  checkForError,
  getTextFieldOnBlurFn,
  getTextFieldOnChangeFn,
} from "../../../utils/helperFunctions";

const { mainGridFormat, smallInput, largeInput } = alternateGridFormatting;

// Types
interface SecondFootageFormType {
  handleNext: (
    newMaxSteps?: number,
    newActiveStep?: number,
    hasError?: boolean
  ) => void;
}

interface CommonFormProps {
  report: Report;
  updateReport: UpdateReportType;
  errors: ErrorsType;
  setErrors: SetErrorsType;
}

// Component implementations
const SecondFootageForm: FC<SecondFootageFormType> = function ({ handleNext }) {
  const theme = useTheme();
  const [report, updateReport] = useReportContext();

  const textRef = useRef<Record<string, HTMLInputElement | null>>({});

  const isLA = report.incidentInformation.reportType === "LA";

  const [errors, setErrors] = useState<ErrorsType>(
    isLA
      ? {
          timeMoveOff: "",
          [timingInputToPhoto.timeMoveOff]: "",
          justification: "",
        }
      : {
          hasBufferTime: "",
          bufferingTime: "",
          bufferingLocation: "",
          justification: "",
        }
  );

  const handleSubmit = function (event: React.FormEvent) {
    event.preventDefault();

    const newErrors = { ...errors };
    if (!report.cameraInformation.hasBufferTime) {
      delete newErrors.bufferingTime;
      delete newErrors.bufferingLocation;
    }

    let hasError = false;

    if (checkForError(newErrors, setErrors, report.cameraInformation))
      hasError = true;
    if (checkForError(newErrors, setErrors, report.generalInformation))
      hasError = true;

    handleNext(undefined, undefined, hasError);
  };

  useEffect(() => {
    const reportType = report.incidentInformation.reportType;
    if (!reportType) return;

    if (report.generalInformation.justification === "") {
      const justification = defaultJustification[reportType];
      const value =
        typeof justification === "function"
          ? justification(report.generalInformation.boundary)
          : justification;

      updateReport.generalInformation("justification", value);
    }
  }, []);

  const commonProps = {
    report: report,
    updateReport: updateReport,
    errors: errors,
    setErrors: setErrors,
  } as const;

  return (
    <Fade in={true} timeout={500}>
      <form id="secondFootageForm" onSubmit={handleSubmit}>
        {isLA ? <LAForm {...commonProps} /> : <LRForm {...commonProps} />}

        <Section
          id="justification-section"
          title="Justification"
          icon={<Notes />}
          accentColor={theme.palette.secondary.main}
        >
          <TextField
            valueKey="justification"
            errorText={errors.justification ?? ""}
            setErrors={setErrors}
            refHook={textRef}
            multiline
          />
        </Section>
      </form>
    </Fade>
  );
};

/**
 * Form variants based on report type
 */
const LAForm: FC<CommonFormProps> = function ({ report, errors, setErrors }) {
  return (
    <TimingAndPhotoInput
      timingInput={{ timeMoveOff: report.cameraInformation.timeMoveOff }}
      reportKey="cameraInformation"
      errors={errors}
      setErrors={setErrors}
      icon={<FireTruck />}
    />
  );
};

const LRForm: FC<CommonFormProps> = function ({
  report,
  updateReport,
  errors,
  setErrors,
}) {
  const theme = useTheme();
  const { cameraInformation, acesInformation } = report;

  const [totalTime, setTotalTime] = useState<Time>(new Time(0, 0));
  const textFieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const activationTime = Time.calculateTime(
      acesInformation.timeDispatched,
      acesInformation.timeEnRoute
    );
    const responseTime = Time.calculateTime(
      cameraInformation.timeMoveOff,
      cameraInformation.timeArrived,
      cameraInformation.bufferingTime
    );

    setTotalTime(activationTime.add(responseTime));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraInformation.bufferingTime]); // Only buffering time will change on this page

  return (
    <>
      <Section
        id="buffer-section"
        title="Buffer Time Settings"
        icon={<HourglassTop />}
        accentColor={theme.palette.warning.main}
      >
        <Box sx={{ justifyContent: "center", display: "flex", mb: 3 }}>
          <FormControl
            sx={{
              width: "100%",
              maxWidth: "80%",
            }}
          >
            <Stack direction="column" spacing={1} alignItems="center">
              <Typography variant="subtitle2" color="textSecondary">
                Does this incident have buffer time?
              </Typography>
              <ToggleButtonInputType
                id="hasBufferTime"
                title=""
                buttonTextsValues={{
                  Yes: true,
                  No: false,
                }}
                error={!!errors.hasBufferTime}
                setErrors={setErrors}
                accentColor={theme.palette.warning.main}
              />
            </Stack>
          </FormControl>
        </Box>
      </Section>

      {cameraInformation.hasBufferTime && (
        <Section
          id="buffer-details"
          title="Buffer Details"
          icon={<LocationOn />}
          accentColor={theme.palette.info.main}
        >
          <Grid {...mainGridFormat}>
            <Grid size={smallInput}>
              <TimeLengthPicker
                entryKey="bufferingTime"
                accentColor={theme.palette.info.main}
                errorText={errors.bufferingTime ?? ""}
                setErrors={setErrors}
              />
            </Grid>
            <Grid size={largeInput}>
              <MuiTextField
                label="Location"
                variant="outlined"
                value={cameraInformation.bufferingLocation}
                onChange={getTextFieldOnChangeFn(
                  updateReport,
                  setErrors,
                  "bufferingLocation",
                  textFieldRefs
                )}
                onBlur={getTextFieldOnBlurFn(
                  setErrors,
                  report,
                  "bufferingLocation"
                )}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">along</InputAdornment>
                    ),
                  },
                }}
                error={!!errors.bufferingLocation}
                helperText={errors.bufferingLocation}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor:
                totalTime.totalSeconds / 60 >
                Number(report.generalInformation.boundary)
                  ? alpha(theme.palette.error.light, 0.1)
                  : alpha(theme.palette.success.light, 0.1),
              border: `1px solid ${
                totalTime.totalSeconds / 60 >
                Number(report.generalInformation.boundary)
                  ? alpha(theme.palette.error.main, 0.2)
                  : alpha(theme.palette.success.main, 0.2)
              }`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography align="center" variant="subtitle1">
              Total time:{" "}
              <Typography
                component="span"
                fontWeight={600}
                sx={{
                  color:
                    totalTime.totalSeconds / 60 >
                    Number(report.generalInformation.boundary)
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                }}
              >
                {totalTime.toString(true)}
              </Typography>
            </Typography>
          </Box>
        </Section>
      )}
    </>
  );
};

export default SecondFootageForm;
