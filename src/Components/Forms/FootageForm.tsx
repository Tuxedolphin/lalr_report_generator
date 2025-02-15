import { FC, useEffect, useState } from "react";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
import { ReportImage } from "../../classes/Report";
import { useReportContext } from "../../utils/contextFunctions";

interface FootageFormProps {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const FootageForm: FC<FootageFormProps> = (props) => {
  const { setActiveStep } = props;

  const [report, updateReport] = useReportContext()

  const isLA = report.incidentInformation.reportType === "LA";

  const [cameraInformation, setCameraInformation] =
    useState(
      isLA
        ? {
            timeDispatched:
              report.cameraInformation.timeDispatched ?? null,
            timeAllIn: report.cameraInformation.timeAllIn ?? null,
            timeMoveOff: report.cameraInformation.timeMoveOff ?? null,
          }
        : {
            timeResponded: report.cameraInformation.timeResponded ?? null,
            timeArrived: report.cameraInformation.timeArrived ?? null,
          }
    );


  return (
    <>
      <TimingAndPhotoInput
        timingInput={{
          [Object.keys(cameraInformation)[0]]:
            Object.values(cameraInformation)[0],
        }}
        image={report.cameraInformation.arrivedPhoto ?? new ReportImage()}
        updateInformation={updateInformation}
      />
    </>
  );
};

export default FootageForm;
