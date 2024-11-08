/// <reference types="vite-plugin-svgr/client" />

import { camelCaseToTitleCase } from "../Functions/functions";
import { FC, useState, useEffect, useMemo } from "react";
import {
  Divider,
  Paper,
  Grid2 as Grid,
  SvgIcon,
  useMediaQuery,
} from "@mui/material";
import { FireTruck, WhereToVote } from "@mui/icons-material";
import AlarmSiren from "../assets/alarm-siren.svg?react";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

export interface TimingInputsType {
  timeDispatched: Dayjs | null;
  timeResponded?: Dayjs | null;
  timeEnRoute?: Dayjs | null;
  timeMoveOff?: Dayjs | null;
  timeArrived?: Dayjs | null;
};
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
  isDarkMode: boolean;
  timingInputs: TimingInputsType;
  setTimingInputs: React.Dispatch<React.SetStateAction<TimingInputsType>>;
}

export const TimingInputs: FC<TimingInputsProps> = (props) => {
  const { headerText, isDarkMode, timingInputs, setTimingInputs } = props;

  const [entryDisplayWords, setEntryDisplayWords] = useState({
    first: "",
    second: "",
    third: "",
  });

  const secondEntryType:
    | "timeResponded"
    | "timeEnRoute"
    | "timeMoveOff"
    | null = useMemo(() => {
    let type = null;

    for (const key of Object.keys(timingInputs)) {
      if (["timeResponded", "timeEnRoute", "timeMoveOff"].includes(key)) {
        type = key as "timeResponded" | "timeEnRoute" | "timeMoveOff";
      }
    }
    return type;
  }, []);

  // Setting which rows are necessary to show and their corresponding texts
  useEffect(() => {
    const newEntryDisplayWords = { ...entryDisplayWords };

    for (const entry of Object.keys(timingInputs)) {
      switch (entry) {
        case "timeDispatched":
          newEntryDisplayWords.first = camelCaseToTitleCase(entry);
          break;

        case "timeResponded":
        case "timeEnRoute":
        case "timeMoveOff":
          newEntryDisplayWords.second = camelCaseToTitleCase(entry);
          break;

        case "timeArrived":
          newEntryDisplayWords.third = camelCaseToTitleCase(entry);
          break;
      }
    }

    setEntryDisplayWords(newEntryDisplayWords);
  }, []);

  return (
    <Paper sx={{ p: 1, marginTop: 2 }}>
      <Divider>{headerText}</Divider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid {...mainGridFormat} sx={{ paddingTop: 1 }}>
          <Grid
            container
            spacing={2}
            columns={5}
            sx={{ paddingLeft: 2, paddingRight: 2, width: "100%" }}
          >
            {entryDisplayWords.first && (
              <>
                <Grid
                  size={1}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SvgIcon sx={{ width: 45, height: 45 }}>
                    <AlarmSiren
                      width={"100%"}
                      height={"100%"}
                      style={{ fill: isDarkMode ? "#fff" : "#262626" }}
                    />
                  </SvgIcon>
                </Grid>
                <Grid size={4}>
                  <TimePicker
                    label="Time Dispatched"
                    sx={{ width: "100%" }}
                    value={timingInputs.timeDispatched}
                    onChange={(time: Dayjs | null) => {
                      setTimingInputs({
                        ...timingInputs,
                        timeDispatched: time,
                      });
                    }}
                  />
                </Grid>
              </>
            )}{" "}
            {entryDisplayWords.second && (
              <>
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
                  <TimePicker
                    label="Time En Route"
                    sx={{ width: "100%" }}
                    value={
                      secondEntryType ? timingInputs[secondEntryType] : null
                    }
                    onChange={(time: Dayjs | null) => {
                      setTimingInputs({
                        ...timingInputs,
                        [secondEntryType as string]: time,
                      });
                    }}
                  />
                </Grid>
              </>
            )}{" "}
            {entryDisplayWords.third && (
              <>
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
                  <TimePicker
                    label="Time Arrived"
                    sx={{ width: "100%" }}
                    value={timingInputs.timeArrived}
                    onChange={(time: Dayjs | null) => {
                      setTimingInputs({
                        ...timingInputs,
                        timeArrived: time,
                      });
                    }}
                  />
                </Grid>
                <Grid size={1} />
              </>
            )}
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Paper>
  );
};
