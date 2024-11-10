import { FC, useState } from "react";
import { TimingInputs, TimingInputsType } from "./TimingInputs";
import { Paper } from "@mui/material";
import { type MultipleInputEditsType, Report } from "../Classes/Report";

interface FootageFormProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  reportEntry: Report;
  updateEntry: (edits: MultipleInputEditsType) => void;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
}

const FootageForm: FC<FootageFormProps> = (props) => {
  const { setText, reportEntry, updateEntry, setActiveStep, isDarkMode } =
    props;

  const [timingInputs, setTimingInputs] = useState<TimingInputsType>(
    reportEntry.incidentInformation.reportType == "LA"
      ? {
          timeDispatched: null,
          timeResponded: null,
        }
      : {
          timeDispatched: null,
          timeEnRoute: null,
          timeArrived: null,
        }
  );

  return (
    <>
      <Paper></Paper>

      <TimingInputs
        headerText="Timings From Footage"
        isDarkMode={isDarkMode}
        timingInputs={timingInputs}
        setTimingInputs={setTimingInputs}
      />
    </>
  );
};

export default FootageForm;
