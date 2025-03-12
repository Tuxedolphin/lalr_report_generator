import {
  Divider,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid2 as Grid,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { TimingInputs, type TimingInputsType } from "../TimingInputs";
import AddPhotosButton from "../AddPhotosButton";
import { gridFormatting } from "../../utils/constants";

import { useReportContext } from "../../utils/contextFunctions";

const { mainGridFormat, smallInput } = gridFormatting;

type TimingsKey =
  | "timeDispatched"
  | "timeResponded"
  | "timeEnRoute"
  | "timeArrived";

interface AcesFormProps {
  handleNext: (newActiveStep?: number, newMaxSteps?: number) => void
}

export const AcesForm: FC<AcesFormProps> = function ({ handleNext }) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleNext();
  };

  const [report, updateReport] = useReportContext();
  const acesInformation = report.acesInformation;
  const generalInformation = report.generalInformation;

  const isLR = report.incidentInformation.reportType === "LR";

  // Explicity defining the timings as the keys are to be used as the prompt for each entry
  const [timings, setTimings] = useState<TimingInputsType>(
    isLR
      ? {
          timeDispatched: null,
          timeEnRoute: null,
          timeArrived: null,
        }
      : {
          timeDispatched: null,
          timeResponded: null,
        }
  );

  // On page load, make sure that all of the timings are loaded in correctly
  useEffect(() => {
    const newTimings = timings;

    for (const key of Object.keys(newTimings)) {
      const timing = acesInformation[key as TimingsKey];
      if (timing !== undefined) newTimings[key as TimingsKey] = timing;
    }

    setTimings(newTimings);
  }, [acesInformation]);

  return (
    <form id="acesInfoForm" onSubmit={handleSubmit}>
      <AddPhotosButton photoType="acesScreenshot" />
      {isLR && (
        <Paper sx={{ p: 1, textAlign: "center", marginTop: 2 }}>
          <Divider sx={{ paddingBottom: 1 }}>Incident Information</Divider>
          <Grid {...mainGridFormat}>
            <Grid size={smallInput}>
              <TextField
                label="Weather"
                value={generalInformation.weather ?? ""}
                onChange={(event) => {
                  updateReport("weather", event.target.value);
                }}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid size={smallInput}>
              <FormControl fullWidth>
                <InputLabel id="response-zone">Response Zone</InputLabel>
                <Select
                  labelId="response-zone"
                  label="Response Zone"
                  value={
                    generalInformation.boundary ?? ""
                  }
                  onChange={(event: SelectChangeEvent) => {
                    updateReport("boundary", event.target.value);
                  }}
                >
                  <MenuItem value={"8"}>8 Minutes</MenuItem>
                  <MenuItem value={"11"}>11 Minutes</MenuItem>
                  <MenuItem value={"13"}>13 Minutes</MenuItem>
                  <MenuItem value={"15"}>15 Minutes</MenuItem>
                  <MenuItem value={">15"}>{">15 Minutes"}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            label="Incident Outcome"
            value={generalInformation.incidentOutcome ?? ""}
            onChange={(event) => {
              updateReport("incidentOutcome", event.target.value);
            }}
            multiline
            rows={3}
            fullWidth
          />
        </Paper>
      )}
      <Paper sx={{ marginTop: 1, padding: 1 }}>
        <TimingInputs headerText="Timings From Aces" timingInputs={timings} />
      </Paper>
    </form>
  );
};
