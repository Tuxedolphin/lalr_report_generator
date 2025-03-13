/// <reference types="vite-plugin-svgr/client" />

import { camelCaseToTitleCase } from "../utils/generalFunctions";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Divider, Grid2 as Grid, Box } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC, useState, useEffect, useMemo } from "react";
import {
  useIsDarkModeContext,
  useReportContext,
} from "../context/contextFunctions";
import { alternateGridFormatting } from "../utils/constants";

export interface TimingInputsType {
  timeDispatched?: Dayjs | null;
  timeAllIn?: Dayjs | null;
  timeResponded?: Dayjs | null;
  timeEnRoute?: Dayjs | null;
  timeMoveOff?: Dayjs | null;
  timeArrived?: Dayjs | null;
}

const mainGridFormat = alternateGridFormatting.mainGridFormat;

type secondEntryKeys =
  | "timeResponded"
  | "timeEnRoute"
  | "timeMoveOff"
  | "timeAllIn";

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
    total: 0,
  });

  const secondEntryType: secondEntryKeys | null = useMemo(() => {
    let type = null;

    for (const key of Object.keys(timingInputs)) {
      if (
        ["timeResponded", "timeEnRoute", "timeMoveOff", "timeAllIn"].includes(
          key
        )
      ) {
        type = key as secondEntryKeys;
      }
    }

    return type;
  }, [timingInputs]);

  useEffect(() => {
    const newDisplay = { first: false, second: false, third: false };
    let counter = 0;

    const inputs = Object.keys(timingInputs);

    if (inputs.includes("timeDispatched")) {
      newDisplay.first = true;
      counter++;
    }
    if (secondEntryType) {
      newDisplay.second = true;
      counter++;
    }
    if (inputs.includes("timeArrived")) {
      newDisplay.third = true;
      counter++;
    }

    setDisplay({ ...newDisplay, total: counter });
  }, [secondEntryType, timingInputs]);

  const [_, updateReport] = useReportContext();

  return (
    <>
      {headerText && <Divider sx={{ paddingBottom: 1 }}>{headerText}</Divider>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid {...mainGridFormat}>
          {display.first && (
            <>
              <Grid size={6 / display.total}>
                <TimePicker
                  label="Time Dispatched"
                  sx={{ width: "100%" }}
                  value={timingInputs.timeDispatched}
                  views={["hours", "minutes", "seconds"]}
                  onChange={(time: Dayjs | null) => {
                    updateReport("timeDispatched", time);
                  }}
                />
              </Grid>
            </>
          )}{" "}
          {display.second && (
            <>
              <Grid size={6 / display.total}>
                <TimePicker
                  label={camelCaseToTitleCase(secondEntryType ?? "")}
                  sx={{ width: "100%" }}
                  value={secondEntryType ? timingInputs[secondEntryType] : null}
                  views={["hours", "minutes", "seconds"]}
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
              <Grid size={6 / display.total}>
                <TimePicker
                  label="Time Arrived"
                  sx={{ width: "100%" }}
                  value={timingInputs.timeArrived}
                  views={["hours", "minutes", "seconds"]}
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
