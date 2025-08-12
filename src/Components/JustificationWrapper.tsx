import { FC, useRef, useState } from 'react';
import { Grid2 as Grid } from '@mui/material';
import TextField from "../Components/TextField";
import ToggleButtonInputType from './ToggleButtonInputType';
import { useReportContext } from '../context/contextFunctions';
import { LRJustificationType } from '../types/types';
import {
  gridFormatting,
} from "../utils/constants";

const { mainGridFormat, smallInput} = gridFormatting;

interface JustificationFieldWrapperProps {
  id: 'sftl' | 'trafficCongestion' | 'inclementWeather' | 'acesRouteDeviation';
  title?: string;
  label?: string;
  initialError?: boolean;
  error: boolean;
  setErrors: (errors: any) => void;
}

const JustificationFieldWrapper: FC<JustificationFieldWrapperProps> = ({
  id,
  label,
  error,
  initialError = false, 
  setErrors,
}) => {
  const textFieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [report, updateReport] = useReportContext();

  const justification = report.generalInformation[id] as LRJustificationType;
  const isSelected = justification?.selected || false;
  const remarks = justification?.remarks || '';
  const [hasInteracted] = useState(false);
  //const [hasInteracted, setHasInteracted] = useState(false);

  // const handleToggleChange = (_event: any, newValue: boolean | null) => {
  //   if (newValue === null) return;

  //   setHasInteracted(true);
  //   setErrors((prev: any) => ({ ...prev, [id]: '' }));

  //   updateReport.generalInformation(id, {
  //     ...justification,
  //     selected: newValue,
  //     remarks: newValue ? remarks : ''
  //   });
  // };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRemarks = e.target.value;

    updateReport.generalInformation(id, {
      ...justification,
      remarks: newRemarks
    });
  };

  const showError = hasInteracted ? error : initialError;

  return (
    <Grid {...mainGridFormat} sx={{ mb: 3 }}>
        <Grid size={2}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            {label}
          </div>
        </Grid>
        <Grid size={3}>
        <ToggleButtonInputType
        id={id}
        title=""
        buttonTextsValues={{ "Yes": true, "No": false }}
        error={showError}
        setErrors={setErrors}
        />
        </Grid>
        <Grid size={smallInput}>
            <TextField
            value={remarks}
            onChange={handleRemarksChange}
            valueKey={id}
            errorText={showError ? "Required" : ""} 
            setErrors={setErrors}
            refHook={textFieldRefs}
            multiline
            label="Remarks"
            disabled={!isSelected}
            />
        </Grid>
    </Grid>
  );
};

export default JustificationFieldWrapper;
