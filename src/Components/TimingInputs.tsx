import { FC } from "react";
import { Divider, Paper, Grid2 as Grid } from "@mui/material";
import { FireTruck, WhereToVote } from "@mui/icons-material";
import FireAlarm from "../assets/alarm-siren.svg";
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

interface TimingInputsProps {
  headerText: string;
}

const TimingInputs: FC<TimingInputsProps> = (props) => {
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

export default TimingInputs;
