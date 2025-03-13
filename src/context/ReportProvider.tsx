/**
 * Context to hold information of current report and function to update it
 */

import { FC, useState } from "react";
import Report from "../classes/Report";
import { ReportContext } from "./contextFunctions";
import {
  type ChildrenOnly,
  type ReportValueKeysType,
  type ReportValueTypes,
} from "../types/types";

const ReportProvider: FC<ChildrenOnly> = function ({ children }) {
  const [report, setReport] = useState<Report>(new Report());

  const updateReport = function (
    key: ReportValueKeysType,
    value: ReportValueTypes
  ) {
    setReport(Report.updateReport(report, key, value));
  };

  return (
    <ReportContext.Provider value={[report, updateReport, setReport]}>
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
