import { FC } from "react";
import {TimingInputs} from "./TimingInputs";
import { Paper } from "@mui/material";

const LRAcesForm: FC = () => {
  return (
    <>
      <Paper></Paper>

      <TimingInputs headerText="Timings From Footage" />
    </>
  );
};

export default LRAcesForm;
