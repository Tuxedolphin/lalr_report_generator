import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FC } from "react";
import { camelCaseToTitleCase } from "../utils/helperFunctions";
import { useReportContext } from "../context/contextFunctions";
import { type Dayjs } from "dayjs";

interface TimeLengthPickerProps {
  // Only the following has the time length, currently its only the buffering time but more can be added
  entryKey: "bufferingTime";
}

const TimeLengthPicker: FC<TimeLengthPickerProps> = function ({ entryKey }) {
  const [report, updateReport] = useReportContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        sx={{ width: "100%", touchAction: "pan-y" }}
        label={camelCaseToTitleCase(entryKey)}
        value={report.cameraInformation[entryKey]}
        views={["minutes", "seconds"]}
        onChange={(time: Dayjs | null) => {
          updateReport.cameraInformation(entryKey, time);
          report.updateDBReport("cameraInformation");
        }}
      />
    </LocalizationProvider>
  );
};

export default TimeLengthPicker;
