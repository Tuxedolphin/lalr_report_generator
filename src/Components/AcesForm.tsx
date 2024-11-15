import {
  Divider,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid2 as Grid,
} from "@mui/material";
import { FC, useState, useEffect } from "react";
import { TimingInputs, type TimingInputsType } from "./TimingInputs";
import AddPhotosButton from "./AddPhotosButton";
import {
  Report,
  ReportImage,
  type acesInformationType,
  type MultipleInputEditsType,
  type generalInformationType,
} from "../Classes/Report";
import { gridFormatting, checkIfEmptyAndReturn } from "../Functions/functions";
import { Dayjs } from "dayjs";

const { mainGridFormat, smallInput } = gridFormatting;

const generalInformationKeys = ["boundary", "incidentOutcome", "weather"];

interface AcesFormProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  reportEntry: Report;
  updateEntry: (edits: MultipleInputEditsType) => void;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
}

export const AcesForm: FC<AcesFormProps> = (props) => {
  const { setText, reportEntry, updateEntry, setActiveStep, isDarkMode } =
    props;

  const [acesInformation, setAcesInformation] = useState<acesInformationType>(
    {}
  );
  const [generalInformation, setGeneralInformation] =
    useState<generalInformationType>({});

  const [timings, setTimings] = useState<TimingInputsType>(
    reportEntry.incidentInformation.reportType == "LA"
      ? {
          timeDispatched: null,
          timeResponded: null,
        }
      : {
          timeDispatched: null,
          timeEnRoute: null,
          timeArrived: null,
        }
  );

  const isLR = reportEntry.incidentInformation.reportType === "LR";
  const updateInformation = (
    key: keyof generalInformationType | keyof acesInformationType,
    value: string | Dayjs | ReportImage
  ) => {
    if (generalInformationKeys.includes(key)) {
      setGeneralInformation({ ...generalInformation, [key]: value });
    } else {
      setAcesInformation({ ...acesInformation, [key]: value });
    }
  };

  const handleSubmit = () => {
    updateEntry([
      { key: "generalInformation", value: generalInformation },
      { key: "acesInformation", value: { ...acesInformation, ...timings } },
    ]);
    setActiveStep(2);
  };

  useEffect(() => {
    let newTiming;
    if (Object.values(reportEntry.acesInformation).length > 0) {
      setAcesInformation(reportEntry.acesInformation);
      newTiming = { ...timings, ...reportEntry.acesInformation };
    } else {
      setAcesInformation({ acesScreenshot: new ReportImage() });
      newTiming = { ...timings, ...acesInformation };
    }

    if (Object.values(reportEntry.generalInformation).length > 0) {
      setGeneralInformation(reportEntry.generalInformation);
    }

    delete newTiming.acesScreenshot;
    setTimings(newTiming);
  }, []);

  return (
    <form id="aces-form" onSubmit={handleSubmit}>
      <AddPhotosButton
        uploadPhotoText="Upload ACES Photo"
        photoType="acesScreenshot"
        image={
          acesInformation.acesScreenshot
            ? acesInformation.acesScreenshot
            : new ReportImage()
        }
        updateInformation={updateInformation}
      />
      {isLR && (
        <Paper sx={{ p: 1, textAlign: "center", marginTop: 2 }}>
          <Divider sx={{ paddingBottom: 1 }}>Incident Information</Divider>
          <Grid {...mainGridFormat}>
            <Grid size={smallInput}>
              <TextField
                label="Weather"
                value={checkIfEmptyAndReturn(generalInformation.weather)}
                onChange={(event) => {
                  updateInformation("weather", event.target.value);
                }}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid size={smallInput}>
              <FormControl fullWidth>
                <InputLabel id="response-zone">Response Zone</InputLabel>
                <Select
                  labelId="response-zone"
                  label="Response Zone"
                  value={
                    checkIfEmptyAndReturn(generalInformation.boundary) as string
                  }
                  onChange={(event: SelectChangeEvent) => {
                    updateInformation("boundary", event.target.value);
                  }}
                >
                  <MenuItem value={"8"}>8 Minutes</MenuItem>
                  <MenuItem value={"11"}>11 Minutes</MenuItem>
                  <MenuItem value={"13"}>13 Minutes</MenuItem>
                  <MenuItem value={"15"}>15 Minutes</MenuItem>
                  <MenuItem value={">15"}>{">15 Minutes"}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            label="Incident Outcome"
            value={checkIfEmptyAndReturn(generalInformation.incidentOutcome)}
            onChange={(event) => {
              updateInformation("incidentOutcome", event.target.value);
            }}
            multiline
            rows={3}
            fullWidth
          />
        </Paper>
      )}
      <TimingInputs
        headerText="Timings From Aces"
        isDarkMode={isDarkMode}
        timingInputs={timings}
        setTimingInputs={setTimings}
      />
    </form>
  );
};
