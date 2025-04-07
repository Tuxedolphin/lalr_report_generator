// External dependencies
import { FC, useState, useEffect, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2 as Grid,
  useTheme,
  Fade,
  FormHelperText,
} from "@mui/material";
import { CloudQueue, ScreenshotMonitor, Schedule } from "@mui/icons-material";

// Internal components
import {
  TimingInputs,
  type TimingInputsType,
} from "../../../components/TimingInputs";
import AddPhotosButton from "../../../components/AddPhotosButton";
import Section from "../../../components/Section";
import TextField from "../../../components/TextField";

// Context and utilities
import { useReportContext } from "../../../context/contextFunctions";
import {
  gridFormatting,
  inputSx,
  fadeInAnimationSx,
} from "../../../utils/constants";
import {
  getSelectOnChangeFn,
  checkForError,
} from "../../../utils/helperFunctions";

// Types
import { ErrorsType } from "../../../types/types";

// Constants
const { mainGridFormat } = gridFormatting;
const inputSize = { xs: 4, md: 6 } as const;

/**
 * Type for timing-related keys in the ACES information section
 */
type TimingsKey =
  | "timeDispatched"
  | "timeResponded"
  | "timeEnRoute"
  | "timeArrived";

/**
 * Props for the ACES Information Form component
 */
interface AcesFormProps {
  /** Function to handle navigation to the next step in the form flow */
  handleNext: (
    newMaxSteps?: number,
    newActiveStep?: number,
    hasError?: boolean
  ) => void;
}

/**
 * ACES Information Form Component
 *
 * Collects information from the ACES system including screenshots, incident details,
 * and timing information based on the report type (LR or AR).
 */
export const AcesForm: FC<AcesFormProps> = function ({ handleNext }) {
  const theme = useTheme();
  const [report, updateReport] = useReportContext();
  const { acesInformation, generalInformation, incidentInformation } = report;

  // Determine report type and settings
  const isLR = incidentInformation.reportType === "LR";
  const opsCenterAcknowledged = !!incidentInformation.opsCenterAcknowledged;

  // References for text field elements
  const textFieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /**
   * Initialize timings state based on report type
   * LR reports need dispatch, en route, and arrival times
   * AR reports need dispatch and response times
   */
  const [timings, setTimings] = useState<TimingInputsType>(
    isLR
      ? {
          timeDispatched: null,
          ...(opsCenterAcknowledged ? {} : { timeEnRoute: null }),
          timeArrived: null,
        }
      : {
          timeDispatched: null,
          timeResponded: null,
        }
  );

  /**
   * Initialize error states based on report type
   * Different validations apply depending on report type and acknowledgment status
   */
  const [errors, setErrors] = useState<ErrorsType>(
    isLR
      ? {
          acesScreenshot: "",
          weather: "",
          boundary: "",
          incidentOutcome: "",
          timeDispatched: "",
          ...(opsCenterAcknowledged ? {} : { timeEnRoute: "" }),
          timeArrived: "",
        }
      : {
          timeDispatched: "",
          timeResponded: "",
          ...(opsCenterAcknowledged ? { acesScreenshot: "" } : {}),
        }
  );

  /**
   * Load existing timing information when the component mounts
   * This ensures form values persist when returning to this page
   */
  useEffect(() => {
    const newTimings = {} as TimingInputsType;

    // Copy existing timing values from the report context
    for (const key of Object.keys(timings)) {
      const typedKey = key as TimingsKey;
      newTimings[typedKey] = acesInformation[typedKey];
    }

    setTimings(newTimings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Validates the form fields and proceeds to the next step if valid
   * Checks for errors in both ACES information and general information
   *
   * @param event - The form submission event
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let hasError = false;

    // Check for errors in both sections of the form
    if (checkForError(errors, setErrors, acesInformation)) hasError = true;
    if (checkForError(errors, setErrors, generalInformation)) hasError = true;

    handleNext(undefined, undefined, hasError);
  };

  return (
    <Fade in={true} timeout={500}>
      <form id="acesInfoForm" onSubmit={handleSubmit}>
        {/* Only show screenshot section for LR reports or when ops center acknowledged */}
        {(isLR || opsCenterAcknowledged) && (
          <Section
            title="ACES Screenshot"
            icon={<ScreenshotMonitor />}
            accentColor={theme.palette.primary.main}
            sx={fadeInAnimationSx("0s")}
          >
            <AddPhotosButton
              photoType="acesScreenshot"
              error={!!errors.acesScreenshot}
              setErrors={setErrors}
            />
          </Section>
        )}

        {/* Incident information section - only for LR reports */}
        {isLR && (
          <Section
            title="Incident Information"
            icon={<CloudQueue />}
            accentColor={theme.palette.warning.main}
            sx={fadeInAnimationSx("0.1s")}
          >
            <Grid {...mainGridFormat}>
              <Grid size={inputSize}>
                <TextField
                  valueKey="weather"
                  errorText={errors.weather ?? ""}
                  setErrors={setErrors}
                  refHook={textFieldRefs}
                />
              </Grid>
              <Grid size={inputSize}>
                <FormControl
                  fullWidth
                  sx={inputSx(theme.palette.warning.main)}
                  error={!!errors.boundary}
                >
                  <InputLabel id="response-zone">Response Zone</InputLabel>
                  <Select
                    labelId="response-zone"
                    label="Response Zone"
                    fullWidth
                    value={generalInformation.boundary}
                    onChange={getSelectOnChangeFn(
                      updateReport,
                      setErrors,
                      "boundary",
                      report
                    )}
                    sx={inputSx(theme.palette.warning.main)}
                  >
                    <MenuItem value={"8"}>8 Minutes</MenuItem>
                    <MenuItem value={"11"}>11 Minutes</MenuItem>
                    <MenuItem value={"13"}>13 Minutes</MenuItem>
                    <MenuItem value={"15"}>15 Minutes</MenuItem>
                    <MenuItem value={">15"}>{">15 Minutes"}</MenuItem>
                  </Select>
                  <FormHelperText>{errors.boundary ?? ""}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  multiline
                  valueKey="incidentOutcome"
                  errorText={errors.incidentOutcome ?? ""}
                  setErrors={setErrors}
                  refHook={textFieldRefs}
                />
              </Grid>
            </Grid>
          </Section>
        )}

        {/* Timing information section - for all report types */}
        <Section
          title="Timings From ACES"
          icon={<Schedule />}
          accentColor={theme.palette.secondary.main}
          sx={fadeInAnimationSx("0.2s")}
        >
          <TimingInputs
            timingInputs={timings}
            reportKey="acesInformation"
            errors={errors}
            setErrors={setErrors}
            accentColor={theme.palette.secondary.main}
          />
        </Section>
      </form>
    </Fade>
  );
};
