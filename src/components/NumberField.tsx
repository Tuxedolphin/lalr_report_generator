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

interface NumberFieldProps {
  valueKey: ReportValueKeysType;
  errorText: string;
  setErrors: SetErrorsType;
  refHook: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  label?: string;
  sx?: SxProps<Theme>;
  accentColor?: string;
  disabled?: boolean;
  value?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumberField: FC<NumberFieldProps> = function ({
  valueKey: key,
  errorText,
  setErrors,
  refHook: ref,
  label,
  sx,
  accentColor,
  disabled,
  value,
  onChange,
  min,
  max,
  step,
}) {
  if (typeof sx === "function" || Array.isArray(sx))
    throw new Error("sx prop must be an object");

  const [report, updateReport] = useReportContext();
  const theme = useTheme();

  label = label ?? camelCaseToTitleCase(key);

  const onChangeHandler =
    onChange ?? getTextFieldOnChangeFn(updateReport, setErrors, key, ref);
  const onBlur = getTextFieldOnBlurFn(setErrors, report, key);

  const infoKey = getReportKey(key);
  if (!infoKey) throw new Error(`Invalid key: ${key}`);

  const fieldValue =
    value ?? (report[infoKey][key as keyof Report[typeof infoKey]] ?? 0);

  const defaultSx = {
    ...inputSx(accentColor ?? theme.palette.primary.main),
    ...sx,
  };

  return (
    <MuiTextField
      type="number"
      label={label}
      variant="outlined"
      fullWidth
      value={fieldValue}
      onChange={onChangeHandler}
      sx={defaultSx}
      onBlur={onBlur}
      error={!!errorText}
      disabled={disabled}
      helperText={errorText}
      inputRef={(el: HTMLInputElement | null) => (ref.current[key] = el)}
      inputProps={{ min, max, step }}
    />
  );
};

export default NumberField;
