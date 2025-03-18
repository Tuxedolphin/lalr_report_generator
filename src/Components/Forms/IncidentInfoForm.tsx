import React, { FC } from "react";
import {
  TextField,
  Divider,
  Paper,
  Autocomplete,
  Box,
  Grid2 as Grid,
} from "@mui/material";

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

const IncidentInfoForm: FC<GeneralInfoFormProps> = function ({ handleNext }) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleNext(report.incidentInformation.opsCenterAcknowledged ? 3 : 4);
  }

  const [report, updateReport] = useReportContext();

  const information = report.incidentInformation;

  const onBlur = () => {
    report.updateDBReport("incidentInformation");
  };

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
                updateReport.incidentInformation(
                  "incidentNumb",
                  event.target.value
                );
              }}
              onBlur={onBlur}
            />
          </Grid>
          <Grid size={smallInput}>
            <Autocomplete
              options={Object.keys(firePosts)}
              inputValue={information.station}
              value={information.station}
              onInputChange={(_, newValue: string) => {
                updateReport.incidentInformation("station", newValue, true);
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
                updateReport.incidentInformation(
                  "appliance",
                  event.target.value
                );
              }}
              onBlur={onBlur}
              fullWidth
            />
          </Grid>
          <Grid size={largeInput}>
            <TextField
              label="SC Rank and Name"
              variant="outlined"
              value={information.SC}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateReport.incidentInformation("SC", event.target.value);
              }}
              onBlur={onBlur}
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
            updateReport.incidentInformation("turnoutFrom", newValue, true);
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
            updateReport.incidentInformation("typeOfCall", event.target.value);
          }}
          onBlur={onBlur}
          sx={{ marginTop: 2 }}
        />
        <TextField
          label="Incident Location"
          fullWidth
          sx={{ marginTop: 2 }}
          value={information.location}
          onChange={(event) => {
            updateReport.incidentInformation("location", event.target.value);
          }}
          onBlur={onBlur}
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

export default IncidentInfoForm;
