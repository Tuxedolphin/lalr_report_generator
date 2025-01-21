import { FC, useEffect, useState } from "react";
import { TimingInputs, TimingInputsType } from "./TimingInputs";
import TimingAndPhotoInput from "./TimingAndPhotoInput";
import { Paper } from "@mui/material";
import { Dayjs } from "dayjs";
import {
  type MultipleInputEditsType,
  type GeneralInformationType,
  type AcesInformationType,
  type CameraInformationType,
  Report,
  ReportImage,
} from "../classes/Report";

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

  const isLA = reportEntry.incidentInformation.reportType === "LA";

  const [cameraInformation, setCameraInformation] =
    useState<CameraInformationType>(
      isLA
        ? {
            timeDispatched:
              reportEntry.cameraInformation.timeDispatched ?? null,
            timeAllIn: reportEntry.cameraInformation.timeAllIn ?? null,
            timeMoveOff: reportEntry.cameraInformation.timeMoveOff ?? null,
          }
        : {
            timeResponded: reportEntry.cameraInformation.timeResponded ?? null,
            timeArrived: reportEntry.cameraInformation.timeArrived ?? null,
          }
    );

  const updateInformation = (
    key:
      | keyof GeneralInformationType
      | keyof AcesInformationType
      | keyof CameraInformationType,
    value: string | Dayjs | ReportImage
  ) => {
    setCameraInformation({ ...cameraInformation, [key]: value });
  };

  useEffect(() => {
    if (isLA) {
      setCameraInformation({
        ...cameraInformation,
        dispatchPhoto: cameraInformation.dispatchPhoto ?? new ReportImage(),
        allInPhoto: cameraInformation.allInPhoto ?? new ReportImage(),
        moveOffPhoto: cameraInformation.moveOffPhoto ?? new ReportImage(),
      });
    } else {
      setCameraInformation({
        ...cameraInformation,
        bufferingTime: cameraInformation.bufferingTime ?? null,
        bufferingLocation: cameraInformation.bufferingLocation ?? "",
        moveOffPhoto: cameraInformation.moveOffPhoto ?? new ReportImage(),
        arrivedPhoto: cameraInformation.arrivedPhoto ?? new ReportImage(),
      });
    }
  }, []);

  const dataInputs = [] as const;

  return (
    <>
      <TimingAndPhotoInput
        timingInput={{
          [Object.keys(cameraInformation)[0]]:
            Object.values(cameraInformation)[0],
        }}
        image={reportEntry.cameraInformation.arrivedPhoto ?? new ReportImage()}
        updateInformation={updateInformation}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default FootageForm;
