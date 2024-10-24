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
import { FireTruck, WhereToVote } from '@mui/icons-material/';
import { ReactComponent as FireAlarm} from "../assets/alarm-siren.svg"
import { FC, useState } from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

interface AcesFormProps {
  isLA: boolean;
  opsCenterAcknowledge: boolean;
}

const AcesForm: FC<AcesFormProps> = (props) => {
  const [responseZone, setResponseZone] = useState("");

  return (
    <>
      <Paper sx={{ p: 1, textAlign: "center" }}>
        <Divider sx={{ paddingBottom: 1 }}>General Information</Divider>
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
      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider sx={{ paddingBottom: 1 }}>ACES Information</Divider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{display: "flex", }}>
            <TimePicker label="Time Dispatched" />
            <TimePicker label="Time Dispatched" />
            <TimePicker label="Time Dispatched" />
          </Box>
        </LocalizationProvider>
      </Paper>
    </>
  );
};

export default AcesForm;
