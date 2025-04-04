import { FC, useEffect, useState } from "react";
import { useReportContext } from "../../../context/contextFunctions";
import Report from "../../../classes/Report";
import { UpdateReportType } from "../../../types/types";
import TimingAndPhotoInput from "../../../components/TimingAndPhotoInput";
import {
  Paper,
  Divider,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Grid2 as Grid,
  Typography,
  InputAdornment,
  Box,
} from "@mui/material";

import { alternateGridFormatting } from "../../../utils/constants";
import { defaultJustification } from "../../../features/generateReport/utils/constants";
import TimeLengthPicker from "../../../components/TimeLengthPicker";
import Time from "../../../classes/Time";
const { mainGridFormat, smallInput, largeInput } = alternateGridFormatting;

/**
 * The first footage form ended up being too long for a phone interface so I decided to split it up
 */

interface CommonFormProps {
  report: Report;
  updateReport: UpdateReportType;
}

const LAForm: FC<CommonFormProps> = function ({ report }) {
  return (
    <TimingAndPhotoInput
      timingInput={{ timeMoveOff: report.cameraInformation.timeMoveOff }}
      reportKey="cameraInformation"
    />
  );
};

const LRForm: FC<CommonFormProps> = function ({ report, updateReport }) {
  const { cameraInformation, acesInformation } = report;

  const [totalTime, setTotalTime] = useState<Time>(new Time(0, 0));

  useEffect(() => {
    const activationTime = Time.calculateTime(
      acesInformation.timeDispatched,
      acesInformation.timeEnRoute
    );
    const responseTime = Time.calculateTime(
      cameraInformation.timeMoveOff,
      cameraInformation.timeArrived,
      cameraInformation.bufferingTime
    );

    setTotalTime(activationTime.add(responseTime));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraInformation.bufferingTime]);

  return (
    <>
      <Paper sx={{ p: 1, marginTop: 1 }}>
        <Divider>Has Buffer Time</Divider>
        <Box sx={{ justifyContent: "center", display: "flex" }}>
          <FormControl
            sx={{
              width: "100%",
              maxWidth: "80%",
            }}
          >
            <ToggleButtonGroup
              value={cameraInformation.hasBufferTime}
              exclusive
              aria-labelledby={"button-group-control"}
              onChange={(_, newValue: boolean | null) => {
                if (newValue !== null) {
                  updateReport.cameraInformation(
                    "hasBufferTime",
                    newValue,
                    true
                  );
                }
              }}
              fullWidth
              sx={{
                marginTop: 1,
              }}
            >
              <ToggleButton value={true} sx={{ marginTop: 1 }}>
                Yes
              </ToggleButton>
              <ToggleButton value={false} sx={{ marginTop: 1 }}>
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
        </Box>
      </Paper>

      {cameraInformation.hasBufferTime && (
        <Paper sx={{ p: 1, marginTop: 1 }}>
          <Grid {...mainGridFormat}>
            <Grid size={smallInput}>
              <TimeLengthPicker entryKey="bufferingTime" />
            </Grid>
            <Grid size={largeInput}>
              <TextField
                label="Location"
                variant="outlined"
                value={cameraInformation.bufferingLocation}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  updateReport.cameraInformation(
                    "bufferingLocation",
                    event.target.value
                  );
                }}
                onBlur={() => {
                  report.updateDBReport("cameraInformation");
                }}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">along</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>

          <Typography
            sx={{ textAlign: "center", marginTop: 2, marginBottom: 1 }}
          >
            Total time:{" "}
            <Typography
              component="span"
              sx={{
                color:
                  totalTime.totalSeconds / 60 >
                  Number(report.generalInformation.boundary)
                    ? "error"
                    : "success",
              }}
            >
              {totalTime.toString(true)}
            </Typography>
          </Typography>
        </Paper>
      )}
    </>
  );
};

interface SecondFootageFormType {
  handleNext: (newMaxSteps?: number, newActiveStep?: number) => void;
}

const SecondFootageForm: FC<SecondFootageFormType> = function ({ handleNext }) {
  const [report, updateReport] = useReportContext();

  const handleSubmit = function (event: React.FormEvent) {
    event.preventDefault();
    handleNext();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateReport.generalInformation("justification", event.target.value);
  };

  const onBlur = () => {
    report.updateDBReport("generalInformation");
  };

  const commonProps = {
    report,
    updateReport,
  } as const;

  return (
    <form id="secondFootageForm" onSubmit={handleSubmit}>
      {report.incidentInformation.reportType === "LA" ? (
        <LAForm {...commonProps} />
      ) : (
        <LRForm {...commonProps} />
      )}
      <Paper sx={{ p: 1, marginTop: 2 }}>
        <TextField
          label="Justification"
          value={
            report.generalInformation.justification ??
            (report.incidentInformation.reportType === "LA"
              ? defaultJustification.LA
              : defaultJustification.LR(
                  report.generalInformation.boundary ?? "Boundary Time"
                ))
          }
          onChange={onChange}
          onBlur={onBlur}
          multiline
          rows={2}
          fullWidth
        />
      </Paper>
    </form>
  );
};

export default SecondFootageForm;
