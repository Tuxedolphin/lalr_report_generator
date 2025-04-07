import {
  TextField as MuiTextField,
  SxProps,
  Theme,
  useTheme,
} from "@mui/material";
import { FC } from "react";
import { ReportValueKeysType, SetErrorsType } from "../types/types";
import { camelCaseToTitleCase, getReportKey } from "../utils/helperFunctions";
import { useReportContext } from "../context/contextFunctions";
import {
  getTextFieldOnBlurFn,
  getTextFieldOnChangeFn,
} from "../utils/helperFunctions";
import Report from "../classes/Report";
import { inputSx } from "../utils/constants";

interface TextFieldProps {
  valueKey: ReportValueKeysType;
  errorText: string;
  setErrors: SetErrorsType;
  refHook: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  label?: string;
  sx?: SxProps<Theme>;
  accentColor?: string;
  multiline?: boolean;
}

const TextField: FC<TextFieldProps> = function ({
  valueKey: key,
  errorText,
  setErrors,
  refHook: ref,
  label,
  sx,
  accentColor,
  multiline,
}) {
  if (typeof sx === "function" || Array.isArray(sx))
    throw new Error("sx prop must be an object");

  const [report, updateReport] = useReportContext();
  const theme = useTheme();

  label = label ?? camelCaseToTitleCase(key);

  const onChange = getTextFieldOnChangeFn(updateReport, setErrors, key, ref);
  const onBlur = getTextFieldOnBlurFn(setErrors, report, key);

  const infoKey = getReportKey(key);
  if (!infoKey) throw new Error(`Invalid key: ${key}`);

  // Default improved styling that can be overridden with passed sx prop
  const defaultSx = {
    ...inputSx(accentColor ?? theme.palette.primary.main),

    // eslint-disable-next-line @typescript-eslint/no-misused-spread
    ...sx, // Already checked that this is not an array or function
  };

  return (
    <MuiTextField
      label={label}
      variant="outlined"
      fullWidth
      value={report[infoKey][key as keyof Report[typeof infoKey]]}
      sx={defaultSx}
      onChange={onChange}
      onBlur={onBlur}
      error={!!errorText}
      helperText={errorText}
      inputRef={(el: HTMLInputElement | null) => (ref.current[key] = el)}
      multiline={multiline}
      rows={multiline ? 3 : 1}
    />
  );
};

export default TextField;
