import {
  Divider,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { FireTruck, WhereToVote } from "@mui/icons-material";
import FireAlarm from "../assets/alarm-siren.svg";
import { FC, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

/**
 * Defining constants for styling
 */
const mainGridFormat = {
  container: true,
  spacing: { xs: 2, md: 3 },
  columns: { xs: 4, sm: 8 },
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

interface TimingInputsProps {
  headerText: string;
}

export const TimingInputs: FC<TimingInputsProps> = (props) => {
  return (
    <Paper sx={{ p: 1, marginTop: 2 }}>
      <Divider>{props.headerText}</Divider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid {...mainGridFormat} sx={{ paddingTop: 1 }}>
          <Grid
            container
            spacing={2}
            columns={5}
            sx={{ paddingLeft: 2, paddingRight: 2, width: "100%" }}
          >
            <Grid
              size={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={FireAlarm} alt="Fire Alarm" width="45" height="45" />
            </Grid>
            <Grid size={4}>
              <TimePicker label="Time Dispatched" sx={{ width: "100%" }} />
            </Grid>
            <Grid
              size={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FireTruck sx={{ width: 45, height: 45 }} />
            </Grid>
            <Grid size={4}>
              <TimePicker label="Time En Route" sx={{ width: "100%" }} />
            </Grid>
            <Grid
              size={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WhereToVote sx={{ width: 45, height: 45 }} />
            </Grid>
            <Grid size={4}>
              <TimePicker label="Time Arrived" sx={{ width: "100%" }} />
            </Grid>
            <Grid size={1} />
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Paper>
  );
};

interface AcesFormProps {
  isLA: boolean | null;
  opsCenterAcknowledge: boolean | null;
  setText: React.Dispatch<React.SetStateAction<string>>;
}

export const AcesForm: FC<AcesFormProps> = (props) => {
  const [responseZone, setResponseZone] = useState("");

  return (
    <>
      <Paper sx={{ p: 1, textAlign: "center" }}>
        <Divider sx={{ paddingBottom: 1 }}>Incident Information</Divider>
        <Grid {...mainGridFormat}>
          <Grid size={smallInput}>
            <TextField label="Weather" fullWidth sx={{ marginBottom: 2 }} />
          </Grid>
          <Grid size={smallInput}>
            <FormControl fullWidth>
              <InputLabel id="response-zone">Response Zone</InputLabel>
              <Select
                labelId="response-zone"
                label="Response Zone"
                value={responseZone}
                onChange={(event: SelectChangeEvent) => {
                  setResponseZone(event.target.value);
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
        <TextField label="Incident Outcome" multiline rows={3} fullWidth />
      </Paper>
      <TimingInputs headerText="Timings From Aces" />
      <TimingInputs headerText="Timings From Footage" />
    </>
  );
};
