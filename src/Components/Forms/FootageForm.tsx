import { FC, useEffect, useState } from "react";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
import { ReportImage } from "../../classes/Report";
import { CameraInformationType } from "../../types/types";
import { useReportContext } from "../../utils/contextFunctions";

interface FootageFormProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const FootageForm: FC<FootageFormProps> = function ({ setActiveStep }) {
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

export default FootageForm;
