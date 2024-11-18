import AddPhotosButton from "./AddPhotosButton";
import { TimingInputs, type TimingInputsType } from "./TimingInputs";
import { camelCaseToTitleCase } from "../Functions/functions";
import {
  ReportImage,
  type GeneralInformationType,
  type AcesInformationType,
  type CameraInformationType,
} from "../Classes/Report";
import { Paper } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC } from "react";

const timingInputToPhoto = {
  timeDispatched: "dispatchPhoto",
  timeResponded: "moveOffPhoto",
  timeAllIn: "allInPhoto",
  timeMoveOff: "moveOffPhoto",
  timeArrived: "arrivedPhoto",
} as const;

interface TimingAndPhotoInputProps {
  timingInput: TimingInputsType;
  image: ReportImage;
  updateInformation: (
    key:
      | keyof GeneralInformationType
      | keyof AcesInformationType
      | keyof CameraInformationType,
    value: string | Dayjs | ReportImage
  ) => void;
  isDarkMode: boolean;
}

const TimingAndPhotoInput: FC<TimingAndPhotoInputProps> = (props) => {
  const { timingInput, image, updateInformation, isDarkMode } = props;

  if (Object.keys(timingInput).length > 1)
    console.error(
      "Object argument of timingInput has more than 1 key, expected 1"
    );

  const photoType =
    timingInputToPhoto[
      Object.keys(timingInput)[0] as keyof typeof timingInputToPhoto
    ];
  const uploadPhotoText = "upload " + camelCaseToTitleCase(photoType);

  return (
    <Paper>
      <AddPhotosButton
        uploadPhotoText={uploadPhotoText}
        photoType={photoType}
        image={image}
        updateInformation={updateInformation}
      />
      <TimingInputs
        headerText=""
        updateInformation={updateInformation}
        timingInputs={timingInput}
        isDarkMode={isDarkMode}
      />
    </Paper>
  );
};

export default TimingAndPhotoInput;
