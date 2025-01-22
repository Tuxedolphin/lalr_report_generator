/**
 * Context to hold information of current report and function to update it
 */

import { FC, ReactNode, useState } from "react";
import { Report } from "../classes/Report";
import { ReportContext, IsDarkModeContext } from "../utils/contextFunctions";
import {
  type ReportValueKeysType,
  type ReportValueTypes,
} from "../types/types";

interface ContextProviderType {
  children: ReactNode;
}

export const ReportProvider: FC<ContextProviderType> = function({ children }) {
  const [report, setReport] = useState<Report | undefined>(undefined);

  const updateReport = function(
    key: ReportValueKeysType,
    value: ReportValueTypes
  ) {
    setReport(Report.updateReport(report ? report : new Report(), key, value));
  };

  return (
    <ReportContext.Provider value={[report, updateReport]}>
      { children }
    </ReportContext.Provider>
  );
};

export const IsDarkModeProvider: FC<ContextProviderType> = function({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default mode is dark mode

  const updateIsDarkMode = function() {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <IsDarkModeContext.Provider value={[isDarkMode, updateIsDarkMode]}>
      { children }
    </IsDarkModeContext.Provider>
  )

}