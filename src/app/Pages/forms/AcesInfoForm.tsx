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
import {
  TimingInputs,
  type TimingInputsType,
} from "../../../components/TimingInputs";
import AddPhotosButton from "../../../components/AddPhotosButton";
import { useReportContext } from "../../../context/contextFunctions";
import { gridFormatting } from "../../../utils/constants";

const { mainGridFormat, smallInput } = gridFormatting;

type TimingsKey =
  | "timeDispatched"
  | "timeResponded"
  | "timeEnRoute"
  | "timeArrived";

interface AcesFormProps {
  handleNext: (newMaxSteps?: number, newActiveStep?: number) => void;
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
    const newTimings = {} as TimingInputsType;

    for (const key of Object.keys(timings))
      newTimings[key as TimingsKey] = acesInformation[key as TimingsKey];

    setTimings(newTimings);
  }, [acesInformation]);

  return (
    <form id="acesInfoForm" onSubmit={handleSubmit}>
      {!(!isLR && !report.incidentInformation.opsCenterAcknowledged) && <AddPhotosButton photoType="acesScreenshot" />}
      {isLR && (
        <Paper sx={{ p: 1, textAlign: "center", marginTop: 2 }}>
          <Divider sx={{ paddingBottom: 1 }}>Incident Information</Divider>
          <Grid {...mainGridFormat}>
            <Grid size={smallInput}>
              <TextField
                label="Weather"
                value={generalInformation.weather ?? ""}
                onChange={(event) => {
                  updateReport.generalInformation(
                    "weather",
                    event.target.value
                  );
                }}
                onBlur={() => {
                  report.updateDBReport("generalInformation");
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
                  value={generalInformation.boundary ?? ""}
                  onChange={(event: SelectChangeEvent) => {
                    updateReport.generalInformation(
                      "boundary",
                      event.target.value,
                      true
                    );
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
              updateReport.generalInformation(
                "incidentOutcome",
                event.target.value
              );
            }}
            onBlur={() => {
              report.updateDBReport("generalInformation");
            }}
            multiline
            rows={3}
            fullWidth
          />
        </Paper>
      )}
      <Paper sx={{ marginTop: 1, padding: 1 }}>
        <TimingInputs
          headerText="Timings From Aces"
          timingInputs={timings}
          reportKey="acesInformation"
        />
      </Paper>
    </form>
  );
};
