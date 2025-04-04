import { TextField as MuiTextField, SxProps } from "@mui/material";
import { FC } from "react";
import { ReportValueKeysType, SetErrorsType } from "../types/types";
import { camelCaseToTitleCase, getReportKey } from "../utils/helperFunctions";
import { useReportContext } from "../context/contextFunctions";
import {
  getTextFieldOnBlurFn,
  getTextFieldOnChangeFn,
} from "../utils/helperFunctions";
import Report from "../classes/Report";

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

  const onChange = getTextFieldOnChangeFn(updateReport, setErrors, key, ref);
  const onBlur = getTextFieldOnBlurFn(setErrors, report, key);

  const infoKey = getReportKey(key);
  if (!infoKey) throw new Error(`Invalid key: ${key}`);

  return (
    <MuiTextField
      label={label}
      variant="outlined"
      fullWidth
      value={report[infoKey][key as keyof Report[typeof infoKey]]}
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
