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
import { Report } from "../Classes/Report";

const mainGridFormat = {
  container: true,
  spacing: { xs: 2, md: 3 },
  columns: { xs: 4, sm: 8, md: 12 },
};

const smallInput = {
  xs: 2,
  sm: 4,
  md: 4,
};

const largeInput = {
  xs: 4,
  sm: 8,
  md: 8,
};

interface FirstPageFormProps {
  reportEntry: Report;
  updateEntry: (key: string, value: string) => void;
}

const FirstPageForm: FC<FirstPageFormProps> = (props) => {
  const [incNumb, setIncNumber] = useState("");
  const [station, setStation] = useState("");
  const [appliance, setAppliance] = useState("");
  const [sc, setSc] = useState("");
  const [respondingFrom, setRespondingFrom] = useState("");
  const [boundary, setBoundary] = useState("");
  const [turnoutFrom, setTurnoutFrom] = useState("");

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
    localStorage.setItem("station", station);
  }, [station]);

  useEffect(() => {
    setStation(getItem("station"));
  }, []);

  return (
    <>
      <Paper sx={{ p: 1 }}>
        <Divider sx={{ paddingBottom: 1 }}>General Information</Divider>
        <Grid {...mainGridFormat}>
          <Grid size={largeInput}>
            <TextField
              label="Incident Number"
              variant="outlined"
              fullWidth
              value={incNumb}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAppliance(event.target.value);
              }}
            />
          </Grid>
          <Grid size={smallInput}>
            <Autocomplete
              options={Object.keys(firePosts)}
              inputValue={station}
              onInputChange={(_, newValue: string) => {
                setStation(newValue);
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
              value={appliance}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAppliance(event.target.value);
              }}
              fullWidth
            />
          </Grid>
          <Grid size={largeInput}>
            <TextField
              label="SC Rank and Name"
              variant="outlined"
              value={sc}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSc(event.target.value);
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
            station
              ? firePosts[station as keyof typeof firePosts]
              : Object.values(firePosts).flat()
          }
          value={turnoutFrom}
          onInputChange={(_, newValue: string) => {
            setTurnoutFrom(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Turnout From" />
          )}
        />
        <TextField
          label="Type of Call"
          variant="outlined"
          fullWidth
          sx={{ marginTop: 2 }}
        />
        <TextField label="Incident Location" fullWidth sx={{ marginTop: 2 }} />
      </Paper>

      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider>Report Settings</Divider>
        <Grid {...mainGridFormat} sx={{ paddingLeft: 1.5 }}>
          <Grid size={largeInput}>
            <FormControl sx={{ width: "100%" }}>
              <FormLabel id="report-type">Report Type</FormLabel>
              <RadioGroup aria-labelledby="report-type" row>
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
              <RadioGroup aria-labelledby="report-type" row>
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
    </>
  );
};

export default FirstPageForm;
