import { FC, useRef, useState } from "react";
import { Grid2 as Grid } from "@mui/material";
import TextField from "./TextField";
import NumberField from "./NumberField";
import { useReportContext } from "../context/contextFunctions";
import { LRJustificationType } from "../types/types";
import { gridFormatting } from "../utils/constants";

const { mainGridFormat, smallInput } = gridFormatting;

interface JustificationFieldWrapperProps {
  id: "sftl" | "trafficCongestion" | "inclementWeather" | "acesRouteDeviation";
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
  const remarks = justification?.remarks || "";
  const quantity = justification?.quantity || 0;

  const [hasInteracted] = useState(false);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value) || 0;

    updateReport.generalInformation(id, {
      ...justification,
      quantity: newQuantity,
      // If quantity is 0, clear remarks automatically
      remarks: newQuantity > 0 ? justification?.remarks ?? "" : "",
    });
  };

  const handleRemarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRemarks = e.target.value;

    updateReport.generalInformation(id, {
      ...justification,
      remarks: newRemarks,
    });
  };

  const showError = hasInteracted ? error : initialError;

  return (
    <Grid {...mainGridFormat} sx={{ mb: 2 }} container spacing={2} alignItems="center">
      <Grid size={2}>
        <div
          style={{
            display: "flex",
            justifyContent: "center", 
            alignItems: "center",
            height: "100%",
          }}
        >
          {label}
        </div>
      </Grid>
      <Grid size={{xs:2, sm:2, md:2}}>
        <NumberField
          value={quantity}
          onChange={handleQuantityChange}
          valueKey={id}
          errorText=""
          setErrors={setErrors}
          refHook={textFieldRefs}
          min={0}
          step={1}
          label="Quantity"
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
          disabled={quantity<=0}
        />
      </Grid>
    </Grid>
  );
};

export default JustificationFieldWrapper;
