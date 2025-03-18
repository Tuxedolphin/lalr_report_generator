import { FC } from "react";
import { useReportContext } from "../../context/contextFunctions";
import Report from "../../classes/Report";
import { UpdateReportType } from "../../types/types";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
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
} from "@mui/material";
import dayjs from "dayjs";

import { alternateGridFormatting } from "../../utils/constants";
import TimeLengthPicker from "../TimeLengthPicker";
const { mainGridFormat, smallInput, largeInput } = alternateGridFormatting;

/**
 * The first footage form ended up being too long for a phone interface so I decided to split it up
 */

interface CommonFormProps {
  report: Report;
  updateReport: UpdateReportType;
}

// BUG: Fix the display timing bug

const LAForm: FC<CommonFormProps> = function ({ report, updateReport }) {
  return (
    <TimingAndPhotoInput
      timingInput={{ timeMoveOff: report.cameraInformation.timeMoveOff }}
      reportKey="cameraInformation"
    />
  );
};

// TODO: Maybe have to add justification text input?

const LRForm: FC<CommonFormProps> = function ({ report, updateReport }) {
  const cameraInformation = report.cameraInformation;

  return (
    <>
      <Paper sx={{ p: 1, marginTop: 2 }}>
        <Divider>Has Buffer Time</Divider>
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
          <ToggleButtonGroup
            value={cameraInformation.hasBufferTime}
            exclusive
            aria-labelledby={"button-group-control"}
            onChange={(_, newValue: boolean | null) => {
              if (newValue !== null) {
                updateReport.cameraInformation("hasBufferTime", newValue);
                report.updateDBReport("cameraInformation");
              }
            }}
            fullWidth
          >
            <ToggleButton value={true} sx={{ marginTop: 1 }}>
              Yes
            </ToggleButton>
            <ToggleButton value={false} sx={{ marginTop: 1 }}>
              No
            </ToggleButton>
          </ToggleButtonGroup>
        </FormControl>
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
            <Typography component="span" sx={{ color: "red" }}>
              {dayjs().millisecond(4320).minute()}min{" "}
              {dayjs().millisecond(432000).second()}sec
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
    </form>
  );
};

export default SecondFootageForm;
