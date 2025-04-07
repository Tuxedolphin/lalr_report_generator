import AddPhotosButton from "./AddPhotosButton";
import { TimingInputs, type TimingInputsType } from "./TimingInputs";
import { Box, useTheme } from "@mui/material";
import { FC } from "react";
import Section from "./Section";
import { PhotoCamera } from "@mui/icons-material";
import { ErrorsType, SetErrorsType } from "../types/types";
import { timingInputToPhoto } from "../utils/constants";

interface TimingAndPhotoInputProps {
  timingInput: TimingInputsType;
  reportKey: "cameraInformation" | "acesInformation";
  errors: ErrorsType;
  setErrors: SetErrorsType;
  icon?: React.ReactNode;
}

const TimingAndPhotoInput: FC<TimingAndPhotoInputProps> = function ({
  timingInput,
  reportKey,
  errors,
  setErrors,
  icon,
}) {
  const theme = useTheme();

  if (Object.keys(timingInput).length > 1)
    throw new Error(
      "Object argument of timingInput has more than 1 key, expected 1."
    );

  const key = Object.keys(timingInput)[0] as keyof typeof timingInputToPhoto;
  const photoType = timingInputToPhoto[key];
  const title =
    key === "timeDispatched"
      ? "Dispatch Photo & Time"
      : key === "timeAllIn"
        ? "All In Photo & Time"
        : key === "timeMoveOff"
          ? "Move Off Photo & Time"
          : "Arrival Photo & Time";

  return (
    <Section
      id={`section-${key}`}
      title={title}
      icon={icon ?? <PhotoCamera />}
      accentColor={theme.palette.primary.main}
    >
      <Box sx={{ mb: 3 }}>
        <AddPhotosButton
          photoType={photoType}
          error={!!errors[photoType]}
          setErrors={setErrors}
        />
      </Box>
      <TimingInputs
        timingInputs={timingInput}
        reportKey={reportKey}
        accentColor={theme.palette.primary.main}
        errors={errors}
        setErrors={setErrors}
      />
    </Section>
  );
};

export default TimingAndPhotoInput;
