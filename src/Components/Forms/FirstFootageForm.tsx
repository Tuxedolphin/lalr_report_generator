import { FC, useEffect, useState } from "react";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
import { useReportContext } from "../../utils/contextFunctions";


/**
 * The form is broken up into two as on mobile, one form would be a bit too long
 */

interface FirstFootageFormProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const FirstFootageForm: FC<FirstFootageFormProps> = function ({ setActiveStep }) {
  const [report, updateReport] = useReportContext();
  const cameraInformation = report.cameraInformation;
  const isLA = report.incidentInformation.reportType === "LA";

  const timings = isLA
    ? ([
        { timeDispatched: cameraInformation.timeDispatched ?? null },
        { timeAllIn: cameraInformation.timeAllIn ?? null },
        { timeMoveOff: cameraInformation.timeMoveOff ?? null },
      ] as const)
    : ([
        { timeResponded: cameraInformation.timeResponded ?? null },
        { timeArrived: cameraInformation.timeArrived ?? null },
      ] as const);

  const timingAndPhotoInputs = timings.map((timing) => (
    <TimingAndPhotoInput
      timingInput={timing}
      key={Object.keys(timing)[0]}
    ></TimingAndPhotoInput>
  ));

  // TODO: Insert buffering information should it be required

  // bufferingTime: cameraInformation.bufferingTime ?? null,
  // bufferingLocation: cameraInformation.bufferingLocation ?? "",

  return <>{timingAndPhotoInputs}</>;
};

export default FirstFootageForm;
