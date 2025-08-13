import AddPhotosButton from "./AddPhotosButton";
import { TimingInputs, type TimingInputsType } from "./TimingInputs";
import { Box, SxProps, useTheme } from "@mui/material";
import { FC } from "react";
import Section from "./Section";
import { PhotoCamera } from "@mui/icons-material";
import { ErrorsType, SetErrorsType } from "../types/types";
import { timingInputToPhoto } from "../utils/constants";
import { camelCaseToTitleCase } from "../utils/helperFunctions";

interface TimingAndPhotoInputProps {
  timingInput: TimingInputsType;
  reportKey: "cameraInformation" | "acesInformation";
  errors: ErrorsType;
  setErrors: SetErrorsType;
  icon?: React.ReactNode;
  sx?: SxProps;
}

const TimingAndPhotoInput: FC<TimingAndPhotoInputProps> = function ({
  timingInput,
  reportKey,
  errors,
  setErrors,
  icon,
  sx,
}) {
  const theme = useTheme();

  if (Object.keys(timingInput).length > 1)
    throw new Error(
      "Object argument of timingInput has more than 1 key, expected 1."
    );

  const key = Object.keys(timingInput)[0] as keyof typeof timingInputToPhoto;
  const photoType = timingInputToPhoto[key];

  return (
    <Section
      id={`section-${key}`}
      title={`${camelCaseToTitleCase(key.replace("time", ""))} Timing & Picture`}
      icon={icon ?? <PhotoCamera />}
      accentColor={theme.palette.primary.main}
      sx={sx}
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
