import React, { FC } from "react";
import { TextField, Divider, Paper, Autocomplete, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ButtonGroupInput from "../ButtonGroupInput";
import { gridFormatting } from "../../utils/constants";
import { useReportContext } from "../../context/contextFunctions";
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

const GeneralInfoForm: FC<GeneralInfoFormProps> = function ({ handleNext }) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleNext(report.incidentInformation.opsCenterAcknowledged ? 3 : 4);
  }

  const [report, updateReport, addReport] = useReportContext();

  const information = report.incidentInformation;

  return (
    <form id="generalInfoForm" onSubmit={handleSubmit}>
      <Paper sx={{ p: 1 }}>
        <Divider sx={{ paddingBottom: 1 }}>General Information</Divider>
        <Grid {...mainGridFormat}>
          <Grid size={largeInput}>
            <TextField
              label="Incident Number"
              variant="outlined"
              fullWidth
              value={information.incidentNumb}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateReport("incidentNumb", event.target.value);
              }}
            />
          </Grid>
          <Grid size={smallInput}>
            <Autocomplete
              options={Object.keys(firePosts)}
              inputValue={information.station}
              value={information.station}
              onInputChange={(_, newValue: string) => {
                updateReport("station", newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Station" />
              )}
              fullWidth
            />
          </Grid>
          <Grid size={smallInput}>
            <TextField
              label="Call Sign"
              variant="outlined"
              value={information.appliance}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateReport("appliance", event.target.value);
              }}
              fullWidth
            />
          </Grid>
          <Grid size={largeInput}>
            <TextField
              label="SC Rank and Name"
              variant="outlined"
              value={information.SC}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateReport("SC", event.target.value);
              }}
              fullWidth
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
          value={information.turnoutFrom}
          onInputChange={(_, newValue: string) => {
            updateReport("turnoutFrom", newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Turnout From" />
          )}
        />
        <TextField
          label="Type of Call"
          variant="outlined"
          fullWidth
          value={information.typeOfCall}
          onChange={(event) => {
            updateReport("typeOfCall", event.target.value);
          }}
          sx={{ marginTop: 2 }}
        />
        <TextField
          label="Incident Location"
          fullWidth
          sx={{ marginTop: 2 }}
          value={information.location}
          onChange={(event) => {
            updateReport("location", event.target.value);
          }}
        />
      </Paper>

      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider>Report Type</Divider>
        <Box sx={{ justifyContent: "center" }}>
          <ButtonGroupInput
            title=""
            buttonTextsValues={{
              "Late Activation": "LA",
              "Late Response": "LR",
            }}
            id="reportType"
            selected={information.reportType}
          />
        </Box>
      </Paper>
      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider>Ops Center Acknowledged</Divider>
        <Box>
          <ButtonGroupInput
            title=""
            buttonTextsValues={{
              yes: true,
              no: false,
            }}
            id="opsCenterAcknowledged"
            selected={information.opsCenterAcknowledged}
          />
        </Box>
      </Paper>
    </form>
  );
};

export default GeneralInfoForm;
