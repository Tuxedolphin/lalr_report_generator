/**
 * Incident Information Form Component
 * This form collects general incident information, turnout details, and report type
 */

// React imports
import React, { FC, useState, useRef } from "react";

// Material UI imports
import {
  Autocomplete,
  Box,
  Fade,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField as MuiTextField,
  Theme,
  useTheme,
  FormLabel,
} from "@mui/material";
import {
  Info as InfoIcon,
  LocationOn as LocationIcon,
  NoteAlt as NoteIcon,
  Straighten as MeasureIcon,
} from "@mui/icons-material";

// Component imports
import ToggleButtonInputType from "../../../components/ToggleButtonInputType";
import Section from "../../../components/Section";
import TextField from "../../../components/TextField";

// Context and utilities
import { useReportContext } from "../../../context/contextFunctions";
import {
  gridFormatting,
  sectionFormatting,
  inputSx,
  fadeInAnimationSx,
} from "../../../utils/constants";
import {
  checkForError,
  getSelectOnChangeFn,
  getTextFieldOnBlurFn,
  getTextFieldOnChangeFn,
} from "../../../utils/helperFunctions";

// Types
import { ErrorsType, SetErrorsType } from "../../../types/types";

const { mainGridFormat, smallInput, largeInput } = gridFormatting;
const { mainGrid: mainSectionFormat, input: sectionFormat } = sectionFormatting;

/**
 * Fire posts/stations mapping
 * Maps station numbers to their corresponding fire posts
 */
const firePosts = {
  "31": [
    "Yishun Fire Station",
    "Nee Soon Central Fire Post",
    "Sembawang Fire Post",
  ],
  "32": ["Ang Mo Kio Fire Station", "Cheng San Fire Post"],
  "33": ["Sengkang Fire Station", "Braddell Heights Fire Post"],
  "34": ["Punggol Fire Station"],
} as const;

/**
 * Interface for common props used by section components
 */
interface CommonProps {
  theme: Theme;
  errors: ErrorsType;
  setErrors: SetErrorsType;
  textFieldRefs: React.MutableRefObject<
    Record<string, HTMLInputElement | null>
  >;
}

/**
 * IncidentInfoForm props interface
 */
interface IncidentInfoFormProps {
  handleNext: (
    newMaxSteps?: number,
    newActiveStep?: number,
    hasError?: boolean
  ) => void;
}

/**
 * Main IncidentInfoForm Component
 * Collects incident information and validates input before proceeding to next step
 *
 * @param handleNext - Function to proceed to next step in form wizard
 */
const IncidentInfoForm: FC<IncidentInfoFormProps> = function ({ handleNext }) {
  const theme = useTheme();
  const [report] = useReportContext();
  const [errors, setErrors] = useState<ErrorsType>({
    incidentNumb: "",
    station: "",
    appliance: "",
    SC: "",
    turnoutFrom: "",
    typeOfCall: "",
    location: "",
    reportType: "",
    opsCenterAcknowledged: "",
  });
  const textFieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /**
   * Handles form submission
   * Validates form before proceeding to next step
   */
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const hasError = checkForError(
      errors,
      setErrors,
      report.incidentInformation
    );
    if (hasError) {
      handleNext(undefined, undefined, true);
      return;
    }
    handleNext(report.incidentInformation.opsCenterAcknowledged ? 3 : 4);
  }

  const commonProps = {
    theme: theme,
    errors: errors,
    setErrors: setErrors,
    textFieldRefs: textFieldRefs,
  } as const;

  return (
    <Fade in={true} timeout={500}>
      <form id="generalInfoForm" onSubmit={handleSubmit}>
        <Grid {...mainSectionFormat}>
          <Grid size={sectionFormat}>
            <GeneralInformationSection {...commonProps} />
          </Grid>

          <Grid size={sectionFormat}>
            <TurnOutInformationSection {...commonProps} />
          </Grid>

          <Grid size={sectionFormat}>
            <ReportTypeSection {...commonProps} />
          </Grid>
          <Grid size={sectionFormat}>
            <OpsCenterAcknowledgedSection {...commonProps} />
          </Grid>
        </Grid>
      </form>
    </Fade>
  );
};

/**
 * General Information Section Component
 * Collects basic incident details like incident number, station, call sign, and SC info
 */
const GeneralInformationSection: FC<CommonProps> = function ({
  theme,
  errors,
  setErrors,
  textFieldRefs,
}) {
  const [report, updateReport] = useReportContext();
  const information = report.incidentInformation;

  const commonProps = {
    setErrors: setErrors,
    refHook: textFieldRefs,
  } as const;

  return (
    <Section
      title="General Information"
      icon={<InfoIcon />}
      sx={fadeInAnimationSx("0s")}
    >
      <Grid {...mainGridFormat}>
        <Grid size={largeInput}>
          <TextField
            {...commonProps}
            label="Incident Number"
            valueKey="incidentNumb"
            errorText={errors.incidentNumb ?? ""}
            sx={inputSx(theme.palette.primary.main)}
          />
        </Grid>
        <Grid size={smallInput}>
          <FormControl
            fullWidth
            sx={inputSx(theme.palette.warning.main)}
            error={!!errors.station}
          >
            <InputLabel id="station">Station</InputLabel>
            <Select
              labelId="station"
              label="Station"
              fullWidth
              value={information.station}
              onChange={getSelectOnChangeFn(
                updateReport,
                setErrors,
                "station",
                report
              )}
              sx={inputSx(theme.palette.primary.main)}
            >
              {Object.keys(firePosts).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
            {errors.station && (
              <FormLabel
                sx={{
                  color: "error.main",
                  fontSize: "0.75rem",
                  marginTop: 0.5,
                  marginLeft: 1.75,
                }}
              >
                {errors.station}
              </FormLabel>
            )}
          </FormControl>
        </Grid>
        <Grid size={smallInput}>
          <TextField
            {...commonProps}
            label="Call Sign"
            valueKey="appliance"
            errorText={errors.appliance ?? ""}
            sx={inputSx(theme.palette.primary.main)}
          />
        </Grid>
        <Grid size={largeInput}>
          <TextField
            {...commonProps}
            label="SC Rank and Name"
            valueKey="SC"
            errorText={errors.SC ?? ""}
            sx={inputSx(theme.palette.primary.main)}
          />
        </Grid>
      </Grid>
    </Section>
  );
};

/**
 * Turnout Information Section Component
 * Collects information about where the turnout was from, type of call, and incident location
 */
const TurnOutInformationSection: FC<CommonProps> = function ({
  theme,
  errors,
  setErrors,
  textFieldRefs,
}) {
  const [report, updateReport] = useReportContext();
  const information = report.incidentInformation;

  const commonProps = {
    setErrors: setErrors,
    refHook: textFieldRefs,
  } as const;

  return (
    <Section
      title="Turnout Information"
      icon={<LocationIcon />}
      accentColor={theme.palette.warning.main}
      sx={fadeInAnimationSx("0.1s")}
    >
      <Autocomplete
        options={
          information.station
            ? firePosts[information.station as keyof typeof firePosts]
            : Object.values(firePosts).flat()
        }
        fullWidth
        clearOnBlur={false}
        inputValue={information.turnoutFrom}
        onInputChange={getTextFieldOnChangeFn(
          updateReport,
          setErrors,
          "turnoutFrom",
          textFieldRefs
        )}
        onBlur={getTextFieldOnBlurFn(setErrors, report, "turnoutFrom")}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label="Turnout From"
            fullWidth
            error={!!errors.turnoutFrom}
            helperText={errors.turnoutFrom}
            sx={inputSx(theme.palette.warning.main)}
          />
        )}
      />

      <TextField
        {...commonProps}
        label="Type of Call"
        sx={{
          marginTop: 2.5,
          ...inputSx(theme.palette.warning.main),
        }}
        valueKey="typeOfCall"
        errorText={errors.typeOfCall ?? ""}
      />

      <TextField
        {...commonProps}
        label="Incident Location"
        sx={{
          marginTop: 2.5,
          ...inputSx(theme.palette.warning.main),
        }}
        valueKey="location"
        errorText={errors.location ?? ""}
      />
    </Section>
  );
};

/**
 * Report Type Section Component
 * Collects information about the type of report (Late Activation or Late Response)
 */
const ReportTypeSection: FC<CommonProps> = function ({
  theme,
  errors,
  setErrors,
}) {
  return (
    <Section
      title="Report Type"
      icon={<NoteIcon />}
      accentColor={theme.palette.secondary.main}
      sx={fadeInAnimationSx("0.2s")}
    >
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          width: "100%",
          py: 2,
        }}
      >
        <ToggleButtonInputType
          title=""
          id="reportType"
          buttonTextsValues={{
            "Late Activation": "LA",
            "Late Response": "LR",
          }}
          error={!!errors.reportType}
          setErrors={setErrors}
          accentColor={theme.palette.secondary.main}
        />
      </Box>
    </Section>
  );
};

/**
 * Ops Center Acknowledged Section Component
 * Collects information about whether the operations center acknowledged the incident
 */
const OpsCenterAcknowledgedSection: FC<CommonProps> = function ({
  theme,
  errors,
  setErrors,
}) {
  return (
    <Section
      title="Ops Center Acknowledged"
      icon={<MeasureIcon />}
      accentColor={theme.palette.info.main}
      sx={fadeInAnimationSx("0.3s")}
    >
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          width: "100%",
          py: 2,
        }}
      >
        <ToggleButtonInputType
          title=""
          id="opsCenterAcknowledged"
          buttonTextsValues={{
            yes: true,
            no: false,
          }}
          error={!!errors.opsCenterAcknowledged}
          setErrors={setErrors}
          accentColor={theme.palette.info.main}
        />
      </Box>
    </Section>
  );
};

export default IncidentInfoForm;
