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
import { FC, useState } from "react";
import TimingInputs from "./TimingInputs";

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
