import { FC } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";

import { useReportContext } from "../context/contextFunctions";
import { getSelectOnChangeFn } from "../utils/helperFunctions";
import { ReportValueTypes, SetErrorsType } from "../types/types";

interface ButtonGroupInputType {
  id: "opsCenterAcknowledged" | "reportType";
  title: string;
  buttonTextsValues: Record<string, ReportValueTypes>;
  error: boolean;
  setErrors: SetErrorsType;
}

const ButtonGroupInput: FC<ButtonGroupInputType> = function ({
  id,
  title,
  buttonTextsValues,
  error,
  setErrors,
}) {
  const [report, updateReport] = useReportContext();
  const errorColour = useTheme().palette.error.main;
  const handleChange = getSelectOnChangeFn(updateReport, setErrors, id, report);

  const buttons = Object.entries(buttonTextsValues).map(([text, value]) => {
    if (value === null) {
      throw new Error(
        `The values provided for the button group is invalid, current value is ${text}, null`
      );
    }

    return (
      <ToggleButton
        value={value}
        key={text.replace(/ /g, "").toLowerCase()}
        sx={{
          marginTop: 1,
          color: error ? errorColour : undefined,
          borderColor: error ? errorColour : undefined,
        }}
      >
        {text}
      </ToggleButton>
    );
  });

  return (
    <FormControl
      sx={{
        width: "100%",
        maxWidth: "80%",
      }}
      error={error}
    >
      <FormLabel id={id}>{title}</FormLabel>
      <ToggleButtonGroup
        value={report.incidentInformation[id]}
        exclusive
        aria-labelledby={id}
        onChange={handleChange}
        fullWidth
      >
        {buttons}
      </ToggleButtonGroup>
      {error && <FormHelperText>Required</FormHelperText>}
    </FormControl>
  );
};

export default ButtonGroupInput;
