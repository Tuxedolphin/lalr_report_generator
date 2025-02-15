/// <reference types="vite-plugin-svgr/client" />

import { camelCaseToTitleCase } from "../utils/functions";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDarkMode = useIsDarkModeContext() as boolean;
  const [_, updateReport] = useReportContext();

  return (
    <>
      {headerText && <Divider sx={{ paddingBottom: 1 }}>{headerText}</Divider>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid {...mainGridFormat}>
          {entryDisplayWords.first && (
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
          {entryDisplayWords.second && (
            <>
              <Grid size={1}>
                <TimePicker
                  label="Time En Route"
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
          {entryDisplayWords.third && (
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
