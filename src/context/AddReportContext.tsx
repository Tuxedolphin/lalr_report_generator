/**
 * Context to hold information of current report and function to update it
 */

import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Report } from "../classes/Report";
import {
  type ReportValueKeysType,
  type ReportValueTypes,
} from "../types/types";

export interface ReportContextType {
  report: Report | null;
  updateReport: (key: ReportValueKeysType, value: ReportValueTypes) => void;
}

const reportContext = createContext<
  | [
      Report | undefined,
      (key: ReportValueKeysType, value: ReportValueTypes) => void,
    ]
  | undefined
>(undefined);

interface ReportProviderType {
  children: ReactNode;
}

export const ReportProvider: FC<ReportProviderType> = function ({ children }) {
  const [report, setReport] = useState<Report | undefined>(undefined);

  const updateReport = function (
    key: ReportValueKeysType,
    value: ReportValueTypes
  ) {
    setReport(Report.updateReport(report ? report : new Report(), key, value));
  };

  return (
    <reportContext.Provider value={[report, updateReport]}>
      {children}
    </reportContext.Provider>
  );
};
