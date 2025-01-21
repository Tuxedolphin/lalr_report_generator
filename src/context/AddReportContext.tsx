/**
 * Context to hold information of current report and function to update it
 */

import { createContext, useReducer, FC, ReactNode } from "react";
import { type Report } from "../classes/Report";

const reportContext = createContext<Report | null>(null);

interface ReportProviderType {
  children: ReactNode
}

ReportProvider: FC<ReportProviderType> = ({ props }) => {

  return (
    <reportContext.Provider value={}>
    </reportContext.Provider>
  )

}