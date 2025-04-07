import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FC } from "react";
import { camelCaseToTitleCase } from "../utils/helperFunctions";
import { useReportContext } from "../context/contextFunctions";
import { type Dayjs } from "dayjs";
import { alpha, useTheme } from "@mui/material";
import { SetErrorsType } from "../types/types";

interface TimeLengthPickerProps {
  // Only the following has the time length, currently its only the buffering time but more can be added
  entryKey: "bufferingTime";
  accentColor?: string;
  errorText: string;
  setErrors: SetErrorsType;
}

const TimeLengthPicker: FC<TimeLengthPickerProps> = function ({
  entryKey,
  accentColor,
  errorText,
  setErrors,
}) {
  const theme = useTheme();
  const color = accentColor ?? theme.palette.primary.main;
  const [report, updateReport] = useReportContext();

  const handleChange = (time: Dayjs | null) => {
    updateReport.cameraInformation(entryKey, time);
    report.updateDBReport("cameraInformation");
    setErrors((prevErrors) => ({
      ...prevErrors,
      [entryKey]: "",
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        sx={{
          width: "100%",
          touchAction: "pan-y",
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: `0 3px 8px ${alpha(color, 0.15)}`,
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 2px ${alpha(color, 0.2)}`,
            },
          },
        }}
        label={camelCaseToTitleCase(entryKey)}
        value={report.cameraInformation[entryKey]}
        views={["minutes", "seconds"]}
        onChange={handleChange}
        slotProps={{
          textField: {
            error: !!errorText,
            helperText: errorText,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default TimeLengthPicker;
