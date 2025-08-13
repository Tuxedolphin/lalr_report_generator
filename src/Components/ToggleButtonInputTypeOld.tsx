import { FC } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Box,
} from "@mui/material";

import { useReportContext } from "../context/contextFunctions";
import { getToggleButtonOnChangeFn } from "../utils/helperFunctions";
import { ReportValueTypes, SetErrorsType } from "../types/types";

interface ToggleButtonInputType {
  id: "opsCenterAcknowledged" | "reportType" | "hasBufferTime" | "sftl" | "trafficCongestion" | "inclementWeather" | "acesRouteDeviation";
  title: string;
  buttonTextsValues: Record<string, ReportValueTypes>;
  error: boolean;
  setErrors: SetErrorsType;
  accentColor?: string;
}

const ToggleButtonInputType: FC<ToggleButtonInputType> = function ({
  id,
  title,
  buttonTextsValues,
  error,
  setErrors,
  accentColor,
}) {
  const [report, updateReport] = useReportContext();
  const theme = useTheme();
  const errorColour = theme.palette.error.main;
  const handleChange = getToggleButtonOnChangeFn(
    updateReport,
    setErrors,
    id,
    report
  );
  const color = accentColor ?? theme.palette.primary.main;

  const key =
    id in report.incidentInformation
      ? "incidentInformation"
      : "cameraInformation";

  const buttons = Object.entries(buttonTextsValues).map(([text, value]) => {
    if (value === null) {
      throw new Error(
        `The values provided for the button group is invalid, current value is ${text}, null`
      );
    }

    const isSelected =
      key === "incidentInformation"
        ? value ===
          report.incidentInformation[
            id as keyof typeof report.incidentInformation
          ]
        : value ===
          report.cameraInformation[id as keyof typeof report.cameraInformation];

    return (
      <ToggleButton
        value={value}
        key={text.replace(/ /g, "").toLowerCase()}
        sx={{
          marginTop: 1,
          borderRadius: 1.5,
          px: 3,
          py: 1.3,
          fontWeight: isSelected ? 600 : 400,
          color: error
            ? errorColour
            : isSelected
              ? color
              : theme.palette.text.secondary,
          borderColor: error
            ? errorColour
            : isSelected
              ? alpha(color, 0.5)
              : alpha(theme.palette.divider, 0.5),
          "&.Mui-selected": {
            backgroundColor: alpha(color, 0.1),
            color: error ? errorColour : color,
            borderColor: error ? errorColour : alpha(color, 0.3),
            boxShadow:
              isSelected && !error
                ? `inset 0 0 0 1px ${alpha(color, 0.3)}`
                : "none",
            "&:hover": {
              backgroundColor: alpha(color, 0.15),
              borderColor: error ? errorColour : alpha(color, 0.4),
            },
          },
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: alpha(theme.palette.action.hover, 0.15),
            transform: "translateY(-1px)",
          },
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
        maxWidth: "90%",
      }}
      error={error}
    >
      <FormLabel
        id={id}
        sx={{
          mb: 1,
          fontWeight: 500,
          color: error ? errorColour : theme.palette.text.secondary,
          textAlign: "center",
        }}
      >
        {title}
      </FormLabel>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <ToggleButtonGroup
          value={
            key === "incidentInformation"
              ? report.incidentInformation[
                  id as keyof typeof report.incidentInformation
                ]
              : report.cameraInformation[
                  id as keyof typeof report.cameraInformation
                ] // Have to be explicit here since TypeScript doesn't know the type of the key
          }
          exclusive
          aria-labelledby={id}
          onChange={handleChange}
          sx={{
            mt: 0.5,
            boxShadow: error
              ? "none"
              : `0 1px 3px ${alpha(theme.palette.common.black, 0.06)}`,
            borderRadius: 2,
            overflow: "hidden",
            "& .MuiToggleButtonGroup-grouped": {
              border: error
                ? `1px solid ${errorColour}`
                : `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              "&:not(:first-of-type)": {
                borderLeftColor: error
                  ? errorColour
                  : alpha(theme.palette.divider, 0.3),
              },
              "&:first-of-type": {
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
              "&:last-of-type": {
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            },
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: error
                ? `0 3px 10px ${alpha(errorColour, 0.15)}`
                : `0 3px 10px ${alpha(color, 0.15)}`,
            },
          }}
        >
          {buttons}
        </ToggleButtonGroup>
      </Box>
      {error && (
        <FormHelperText
          sx={{
            textAlign: "center",
            mt: 1.5,
            fontWeight: 500,
            animation: "fadeIn 0.3s ease-in",
            "@keyframes fadeIn": {
              "0%": { opacity: 0, transform: "translateY(-5px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          Required
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default ToggleButtonInputType;
