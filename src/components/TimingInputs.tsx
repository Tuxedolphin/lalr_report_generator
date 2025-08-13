/// <reference types="vite-plugin-svgr/client" />

import { camelCaseToTitleCase } from "../utils/helperFunctions";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Divider, Grid2 as Grid, useTheme } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC, useState, useEffect, useMemo } from "react";
import { useReportContext } from "../context/contextFunctions";
import { alternateGridFormatting, inputSx } from "../utils/constants";
import { ErrorsType, SetErrorsType } from "../types/types";

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
  headerText?: string;
  timingInputs: TimingInputsType;
  reportKey: "cameraInformation" | "acesInformation";
  errors: ErrorsType;
  setErrors: SetErrorsType;
  accentColor?: string;
}

export const TimingInputs: FC<TimingInputsProps> = function ({
  headerText,
  timingInputs,
  reportKey,
  errors,
  setErrors,
  accentColor,
}) {
  const theme = useTheme();
  const color = accentColor ?? theme.palette.primary.main;
  const [, updateReport] = useReportContext();

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

    // Ensure all keys in timingInputs are present in errors
    Object.keys(timingInputs).forEach((key) => {
      if (!Object.keys(errors).includes(key)) {
        throw new Error(`Key ${key} is not present in errors object`);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange =
    (key: "timeDispatched" | "timeArrived" | secondEntryKeys | null) =>
    (time: Dayjs | null) => {
      if (!key) return;

      updateReport[reportKey](key as any, time, true);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: "",
      }));
    };

  const getCommonProps = (key: keyof TimingInputsType | null) => {
    return {
      label: camelCaseToTitleCase(key ?? ""),
      value: key ? timingInputs[key] : null,
      onChange: handleChange(key),
      sx: { ...inputSx(color), width: "100%" },
      views: ["hours", "minutes", "seconds"],
      slotProps: {
        textField: {
          error: key ? !!errors[key] : undefined,
          helperText: key ? errors[key] : undefined,
        },
      },
    } as const;
  };

  return (
    <>
      {headerText && <Divider sx={{ paddingBottom: 1 }}>{headerText}</Divider>}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid
          {...mainGridFormat}
          sx={{
            animation: "fadeIn 0.6s ease-out",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(5px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {display.first && (
            <>
              <Grid size={6 / display.total}>
                <TimePicker {...getCommonProps("timeDispatched")} />
              </Grid>
            </>
          )}{" "}
          {display.second && (
            <>
              <Grid size={6 / display.total}>
                <TimePicker {...getCommonProps(secondEntryType)} />
              </Grid>
            </>
          )}{" "}
          {display.third && (
            <>
              <Grid size={6 / display.total}>
                <TimePicker {...getCommonProps("timeArrived")} />
              </Grid>
            </>
          )}
        </Grid>
      </LocalizationProvider>
    </>
  );
};
