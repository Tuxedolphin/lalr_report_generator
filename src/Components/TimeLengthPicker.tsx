import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FC } from "react";
import { camelCaseToTitleCase } from "../utils/generalFunctions";
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
        sx={{ width: "100%" }}
        label={camelCaseToTitleCase(entryKey)}
        value={report.getValue(entryKey) as Dayjs | null}
        views={["minutes", "seconds"]}
        onChange={(time: Dayjs | null) => {
          updateReport(entryKey, time);
        }}
      />
    </LocalizationProvider>
  );
};

export default TimeLengthPicker;
