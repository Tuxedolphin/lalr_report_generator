import { FC, useEffect, useState } from "react";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
import { useReportContext } from "../../utils/contextFunctions";

/**
 * The form is broken up into two as on mobile, one form would be a bit too long
 */

interface FirstFootageFormProps {
  handleNext: (newActiveStep?: number, newMaxSteps?: number) => void;
}

const FirstFootageForm: FC<FirstFootageFormProps> = function ({ handleNext }) {
  const [report, updateReport] = useReportContext();
  const cameraInformation = report.cameraInformation;
  const isLA = report.incidentInformation.reportType === "LA";

  const handleSubmit = function (event: React.FormEvent) {
    event.preventDefault();
    handleNext();
  };

  const timings = isLA
    ? ([
        { timeDispatched: cameraInformation.timeDispatched ?? null },
        { timeAllIn: cameraInformation.timeAllIn ?? null },
      ] as const)
    : ([
        { timeMoveOff: cameraInformation.timeMoveOff ?? null },
        { timeArrived: cameraInformation.timeArrived ?? null },
      ] as const);

  const timingAndPhotoInputs = timings.map((timing) => (
    <TimingAndPhotoInput timingInput={timing} key={Object.keys(timing)[0]} />
  ));

  return (
    <form id="firstFootageForm" onSubmit={handleSubmit}>
      {timingAndPhotoInputs}
    </form>
  );
};

export default FirstFootageForm;
