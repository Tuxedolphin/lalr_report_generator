/// <reference types="vite-plugin-svgr/client" />

import { camelCaseToTitleCase } from "../utils/generalFunctions";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Divider, Grid2 as Grid } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC, useState, useEffect, useMemo } from "react";
import {
  useIsDarkModeContext,
  useReportContext,
} from "../utils/contextFunctions";

export interface TimingInputsType {
  timeDispatched?: Dayjs | null;
  timeAllIn?: Dayjs | null;
  timeResponded?: Dayjs | null;
  timeEnRoute?: Dayjs | null;
  timeMoveOff?: Dayjs | null;
  timeArrived?: Dayjs | null;
}
/**
 * Defining constants for styling
 */
const mainGridFormat = {
  container: true,
  spacing: { xs: 2, md: 3 },
  columns: { xs: 1, sm: 3 },
};

interface TimingInputsProps {
  headerText: string;
  timingInputs: TimingInputsType;
}

export const TimingInputs: FC<TimingInputsProps> = function ({
  headerText,
  timingInputs,
}) {
  const [display, setDisplay] = useState({
    first: false,
    second: false,
    third: false,
  });

  const secondEntryType:
    | "timeResponded"
    | "timeEnRoute"
    | "timeMoveOff"
    | "timeAllIn"
    | null = useMemo(() => {
    let type = null;

    for (const key of Object.keys(timingInputs)) {
      if (
        ["timeResponded", "timeEnRoute", "timeMoveOff", "timeAllIn"].includes(
          key
        )
      ) {
        type = key as
          | "timeResponded"
          | "timeEnRoute"
          | "timeMoveOff"
          | "timeAllIn";
      }
    }

    return type;
  }, [timingInputs]);

  useEffect(() => {
    const newDisplay = { first: false, second: false, third: false };

    const inputs = Object.keys(timingInputs);

    if (inputs.includes("timeDispatched")) newDisplay.first = true;
    if (secondEntryType) newDisplay.second = true;
    if (inputs.includes("timeArrived")) newDisplay.third = true;

    setDisplay(newDisplay);
  }, [secondEntryType, timingInputs]);

  const [_, updateReport] = useReportContext();

  return (
    <>
      {headerText && <Divider sx={{ paddingBottom: 1 }}>{headerText}</Divider>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid {...mainGridFormat}>
          {display.first && (
            <>
              <Grid size={1}>
                <TimePicker
                  label="Time Dispatched"
                  sx={{ width: "100%" }}
                  value={timingInputs.timeDispatched}
                  onChange={(time: Dayjs | null) => {
                    updateReport("timeDispatched", time);
                  }}
                />
              </Grid>
            </>
          )}{" "}
          {display.second && (
            <>
              <Grid size={1}>
                <TimePicker
                  label={camelCaseToTitleCase(secondEntryType ?? "")}
                  sx={{ width: "100%" }}
                  value={secondEntryType ? timingInputs[secondEntryType] : null}
                  onChange={(time: Dayjs | null) => {
                    if (!secondEntryType) return;
                    updateReport(secondEntryType, time);
                  }}
                />
              </Grid>
            </>
          )}{" "}
          {display.third && (
            <>
              <Grid size={1}>
                <TimePicker
                  label="Time Arrived"
                  sx={{ width: "100%" }}
                  value={timingInputs.timeArrived}
                  onChange={(time: Dayjs | null) => {
                    updateReport("timeArrived", time);
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </LocalizationProvider>
    </>
  );
};
