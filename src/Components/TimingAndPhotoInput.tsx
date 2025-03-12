import AddPhotosButton from "./AddPhotosButton";
import { TimingInputs, type TimingInputsType } from "./TimingInputs";
import { Paper } from "@mui/material";
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
}

const TimingAndPhotoInput: FC<TimingAndPhotoInputProps> = function ({
  timingInput,
}) {
  if (Object.keys(timingInput).length > 1)
    throw new Error(
      "Object argument of timingInput has more than 1 key, expected 1."
    );

  const photoType =
    timingInputToPhoto[
      Object.keys(timingInput)[0] as keyof typeof timingInputToPhoto
    ];

  return (
    <>
      <AddPhotosButton photoType={photoType} />
      <Paper sx={{ padding: 1, marginY: 1 }}>
        <TimingInputs headerText="" timingInputs={timingInput} />
      </Paper>
    </>
  );
};

export default TimingAndPhotoInput;
