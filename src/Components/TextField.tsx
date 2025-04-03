import { TextField as MuiTextField, SxProps } from "@mui/material";
import { FC } from "react";
import { ReportValueKeysType, SetErrorsType } from "../types/types";
import { camelCaseToTitleCase } from "../utils/helperFunctions";
import { useReportContext } from "../context/contextFunctions";
import {
  getOnBlurFunction,
  getOnChangeFunction,
} from "../utils/helperFunctions";

interface TextFieldProps {
  valueKey: ReportValueKeysType;
  errorText: string;
  setErrors: SetErrorsType;
  refHook: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  label?: string;
  sx?: SxProps;
}

const TextField: FC<TextFieldProps> = function ({
  valueKey: key,
  errorText,
  setErrors,
  refHook: ref,
  label,
  sx,
}) {
  const [report, updateReport] = useReportContext();

  label = label ?? camelCaseToTitleCase(key);

  const onChange = getOnChangeFunction(updateReport, setErrors, key, ref);
  const onBlur = getOnBlurFunction(setErrors, report, key);

  return (
    <MuiTextField
      label={label}
      variant="outlined"
      fullWidth
      sx={sx}
      onChange={onChange}
      onBlur={onBlur}
      error={!!errorText}
      helperText={errorText}
      inputRef={(el: HTMLInputElement | null) => (ref.current[key] = el)}
    />
  );
};

export default TextField;
