import React, { useState, useEffect, FC } from "react";
import {
  TextField,
  Divider,
  FormLabel,
  Paper,
  Autocomplete,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { getItem } from "../Functions/functions";
import {
  Report,
  type reportType as typeOfReport,
  type IncidentInformationType,
  type EditsType,
  type MultipleInputEditsType,
} from "../Classes/Report";

import { gridFormatting } from "../Functions/functions";
const { mainGridFormat, smallInput, largeInput } = gridFormatting;

interface GeneralInfoFormProps {
  reportEntry: Report;
  updateEntry: (edits: MultipleInputEditsType) => void;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const GeneralInfoForm: FC<GeneralInfoFormProps> = (props) => {
  const { reportEntry, updateEntry, setActiveStep } = props;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateEntry({ key: "incidentInformation", value: information });

    setActiveStep(1); // This form will always be the first one, i.e. index 0
  }

  const [information, setInformation] = useState<IncidentInformationType>({
    incidentNumb: "",
    location: "",
    station: "",
    appliance: "",
    SC: "",
    turnoutFrom: "",
    typeOfCall: "",
    reportType: null,
    opsCenterAcknowledged: null,
  });

  const updateInformation = (
    key: keyof IncidentInformationType,
    value: string | undefined | boolean
  ) => {
    setInformation({ ...information, [key]: value });
    if (key === "station") {
      localStorage.setItem("station", value as string);
    }
  };

  const firePosts = {
    "31": [
      "Yishun Fire Station",
      "Nee Soon Central Fire Post",
      "Sembawang Fire Post",
    ],
    "32": ["Ang Mo Kio Fire Station", "Cheng San Fire Post"],
    "33": ["Sengkang Fire Station", "Braddell Heights Fire Post"],
    "34": ["Punggol Fire Station"],
  };

  useEffect(() => {
    setInformation(reportEntry.incidentInformation);

    if (
      getItem("station") &&
      reportEntry.incidentInformation.opsCenterAcknowledged &&
      !reportEntry.incidentInformation.station
    ) {
      setInformation({ ...information, station: getItem("station") });
    }
  }, []);

  return (
    <form id="general-info-form" onSubmit={handleSubmit}>
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
                updateInformation("incidentNumb", event.target.value);
              }}
            />
          </Grid>
          <Grid size={smallInput}>
            <Autocomplete
              options={Object.keys(firePosts)}
              inputValue={information.station}
              value={information.station}
              onInputChange={(_, newValue: string) => {
                updateInformation("station", newValue);
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
                updateInformation("appliance", event.target.value);
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
                updateInformation("SC", event.target.value);
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
            updateInformation("turnoutFrom", newValue);
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
            updateInformation("typeOfCall", event.target.value);
          }}
          sx={{ marginTop: 2 }}
        />
        <TextField
          label="Incident Location"
          fullWidth
          sx={{ marginTop: 2 }}
          value={information.location}
          onChange={(event) => {
            updateInformation("location", event.target.value);
          }}
        />
      </Paper>

      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider>Report Settings</Divider>
        <Grid {...mainGridFormat} sx={{ paddingLeft: 1.5 }}>
          <Grid size={largeInput}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel id="report-type">Report Type</FormLabel>
              <RadioGroup
                aria-labelledby="report-type"
                row
                value={information.reportType ? information.reportType : null}
                onChange={(event) => {
                  updateInformation("reportType", event.target.value);
                }}
              >
                <Grid container spacing={2} columns={5} sx={{ width: "100%" }}>
                  <Grid size={2}>
                    <FormControlLabel
                      value="LA"
                      control={<Radio />}
                      label="LA"
                    />
                  </Grid>
                  <Grid size="auto">
                    <FormControlLabel
                      value="LR"
                      control={<Radio />}
                      label="LR"
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={largeInput}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel id="report-type">Ops Center Acknowledged</FormLabel>
              <RadioGroup
                aria-labelledby="report-type"
                row
                value={
                  information.opsCenterAcknowledged === undefined 
                    ? null
                    : JSON.stringify(information.opsCenterAcknowledged)
                }
                onChange={(event) => {
                  updateInformation(
                    "opsCenterAcknowledged",
                    JSON.parse(event.target.value) as boolean
                  );
                }}
              >
                <Grid container spacing={2} columns={5} sx={{ width: "100%" }}>
                  <Grid size={2}>
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Yes"
                    />
                  </Grid>
                  <Grid size="auto">
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                    />
                  </Grid>
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};

export default GeneralInfoForm;
