import React, { FC } from "react";
import { IncidentInformationType, ReportValueTypes } from "../types/types";
import {
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useReportContext } from "../context/contextFunctions";

interface ButtonGroupInputType {
  title: string;
  buttonTextsValues: Record<string, ReportValueTypes>;
  id: keyof IncidentInformationType;
  selected: ReportValueTypes;
}

const ButtonGroupInput: FC<ButtonGroupInputType> = function ({
  title,
  buttonTextsValues,
  id,
  selected,
}) {
  const [, updateReport] = useReportContext();

  const buttons = Object.entries(buttonTextsValues).map((button) => {
    const [text, value] = button;

    if (value === null)
      throw new Error(
        `The values provided for the button group is invalid, current value is ${text}, null`
      );

    return (
      <ToggleButton
        value={value}
        key={text.replace(/ /g, "").toLowerCase()}
        sx={{ marginTop: 1 }}
      >
        {text}
      </ToggleButton>
    );
  });

  const handleChange = function (
    _: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) {
    if (!["reportType", "opsCenterAcknowledged"].includes(id))
      throw new Error(`${id} was not implemented to update in DB`);

    updateReport.incidentInformation(id, newValue, true);
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        maxWidth: "80%",
      }}
    >
      <FormLabel id={id}>{title}</FormLabel>
      <ToggleButtonGroup
        value={selected}
        exclusive
        aria-labelledby={id}
        onChange={handleChange}
        fullWidth
      >
        {buttons}
      </ToggleButtonGroup>
    </FormControl>
  );
};

export default ButtonGroupInput;
