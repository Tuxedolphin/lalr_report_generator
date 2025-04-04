import React, { FC, useState, useRef } from "react";
import {
  Autocomplete,
  Box,
  Divider,
  Grid2 as Grid,
  MenuItem,
  Paper,
  TextField as MuiTextField,
} from "@mui/material";

import ButtonGroupInput from "../../../components/ButtonGroupInput";
import TextField from "../../../components/TextField";
import { useReportContext } from "../../../context/contextFunctions";
import { gridFormatting } from "../../../utils/constants";
import {
  ErrorsType,
  IncidentInformationType,
  SetErrorsType,
} from "../../../types/types";

import {
  getSelectOnChangeFn,
  getTextFieldOnBlurFn,
  getTextFieldOnChangeFn,
} from "../../../utils/helperFunctions";

const { mainGridFormat, smallInput, largeInput } = gridFormatting;

// The different fire posts/ fire stations corresponding to each fire station
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

interface GeneralInfoFormProps {
  handleNext: (newMaxSteps?: number, newActiveStep?: number) => void;
}

const IncidentInfoForm: FC<GeneralInfoFormProps> = function ({ handleNext }) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (checkForError(errors, setErrors, report.incidentInformation)) return;
    handleNext(report.incidentInformation.opsCenterAcknowledged ? 3 : 4);
  }

  const [report, updateReport] = useReportContext();
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
  const information = report.incidentInformation;

  const commonProps = {
    setErrors: setErrors,
    refHook: textFieldRefs,
  } as const;

  return (
    <form id="generalInfoForm" onSubmit={handleSubmit}>
      <Paper sx={{ p: 1 }}>
        <Divider sx={{ paddingBottom: 1 }}>General Information</Divider>
        <Grid {...mainGridFormat}>
          <Grid size={largeInput}>
            <TextField
              {...commonProps}
              label="Incident Number"
              valueKey="incidentNumb"
              errorText={errors.incidentNumb ?? ""}
            />
          </Grid>
          <Grid size={smallInput}>
            <MuiTextField
              select
              label="Station"
              fullWidth
              value={information.station}
              onChange={getSelectOnChangeFn(
                updateReport,
                setErrors,
                "station",
                report
              )}
              error={!!errors.station}
              helperText={errors.station}
            >
              {Object.keys(firePosts).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </MuiTextField>
          </Grid>
          <Grid size={smallInput}>
            <TextField
              {...commonProps}
              label="Call Sign"
              valueKey="appliance"
              errorText={errors.appliance ?? ""}
            />
          </Grid>
          <Grid size={largeInput}>
            <TextField
              {...commonProps}
              label="SC Rank and Name"
              valueKey="SC"
              errorText={errors.SC ?? ""}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider sx={{ paddingBottom: 1 }}>Turnout Information</Divider>
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
            />
          )}
        />
        <TextField
          {...commonProps}
          sx={{ marginTop: 2 }}
          valueKey="typeOfCall"
          errorText={errors.typeOfCall ?? ""}
        />
        <TextField
          {...commonProps}
          label="Incident Location"
          sx={{ marginTop: 2 }}
          valueKey="location"
          errorText={errors.location ?? ""}
        />
      </Paper>

      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider>Report Type</Divider>
        <Box sx={{ justifyContent: "center", display: "flex" }}>
          <ButtonGroupInput
            title=""
            id="reportType"
            buttonTextsValues={{
              "Late Activation": "LA",
              "Late Response": "LR",
            }}
            error={!!errors.reportType}
            setErrors={setErrors}
          />
        </Box>
      </Paper>
      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider>Ops Center Acknowledged</Divider>
        <Box sx={{ justifyContent: "center", display: "flex" }}>
          <ButtonGroupInput
            title=""
            id="opsCenterAcknowledged"
            buttonTextsValues={{
              yes: true,
              no: false,
            }}
            error={!!errors.opsCenterAcknowledged}
            setErrors={setErrors}
          />
        </Box>
      </Paper>
    </form>
  );
};

const checkForError = function (
  errors: ErrorsType,
  setErrors: SetErrorsType,
  information: IncidentInformationType
) {
  let hasError = false;

  for (const [key, value] of Object.entries(information)) {
    if (value === "" || value === null || value === undefined) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: `Required`,
      }));
      hasError = true;
    } else if (errors[key as keyof IncidentInformationType]) {
      hasError = true;
    }
  }

  return hasError;
};

export default IncidentInfoForm;
