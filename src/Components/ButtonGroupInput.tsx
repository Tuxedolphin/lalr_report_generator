import React, { FC } from "react";
import { ReportValueKeysType, ReportValueTypes } from "../types/types";
import {
  FormControl,
  FormLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useReportContext } from "../context/contextFunctions";

interface ButtonGroupInputType {
  title: string;
  buttonTextsValues: { [index: string]: ReportValueTypes };
  id: ReportValueKeysType;
  selected: ReportValueTypes;
}

const ButtonGroupInput: FC<ButtonGroupInputType> = function ({
  title,
  buttonTextsValues,
  id,
  selected,
}) {
  const [_, updateReport] = useReportContext();

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
    e: React.MouseEvent<HTMLElement>,
    newValue: string | null
  ) {
    updateReport(id, newValue);
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "80%",
        justifySelf: "center",
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
