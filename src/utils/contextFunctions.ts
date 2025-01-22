/**
 * File for holding the contexts and getter functions for them
 */

import { type Report } from "../classes/Report";
import { useContext, createContext } from "react";
import { ReportValueKeysType, ReportValueTypes } from "../types/types";

export const ReportContext = createContext<
  | [
      Report | undefined,
      (key: ReportValueKeysType, value: ReportValueTypes) => void,
    ]
  | undefined
>(undefined);

/**
 * A getter functions which returns an array of [report, updateReport] in the context. If no context found/ it is undefined,
 * it'll throw an error.
 *
 * @returns [report, updateReport]. updateReport functions requires only the key and value.
 */
export const useReportContext = function () {
  const result = useContext(ReportContext);

  if (result === undefined) {
    throw new Error(
      "Report context was accessed without using Report Provider - report was undefined."
    );
  }

  return result;
};

export const IsDarkModeContext = createContext<
  [boolean, () => void] | undefined
>(undefined);

/**
 * A getter function which returns the boolean isDarkMode and the setter for it (if necessary).
 * If no context found/ it is undefined, it'll throw an error.
 *
 * @param requireSetter An optional parameter of if the update function is required
 * @returns the boolean isDarkMode - true if the current application is in dark mode,
 * or [isDarkMode, updateIsDarkMode] if requireSetter was set as true
 */
export const useIsDarkModeContext = function (requireSetter = false) {
  const result = useContext(IsDarkModeContext);

  if (result === undefined) {
    throw new Error(
      "isDarkMode context was accessed without using the isDarkMode Provider - isDarkMode was undefined."
    );
  }

  return requireSetter ? result : result[0];
};
