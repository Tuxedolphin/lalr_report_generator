/**
 * File for holding the contexts and getter functions for them
 */

import { Report } from "../classes/Report";
import { useContext, createContext } from "react";
import { ReportValueKeysType, ReportValueTypes } from "../types/types";

export const ReportContext = createContext<
  | [
      Report,
      (key: ReportValueKeysType, value: ReportValueTypes) => void,
      React.Dispatch<React.SetStateAction<Report>>,
    ]
  | undefined
>(undefined);

/**
 * A getter functions which returns an array of [report, updateReport] in the context. If no context found/ it is undefined,
 * it'll throw an error.
 *
 * @param report An optional parameter of type Report, add it in if one needs to set the report
 * @returns [report, updateReport]. updateReport functions requires only the key and value.
 */
export const useReportContext = function (report?: Report) {
  const result = useContext(ReportContext);

  if (result === undefined) {
    throw new Error(
      "Report context was accessed without using Report Provider - report was undefined."
    );
  }

  const [r, updateReport, setReport] = result;

  if (report) setReport(report);

  return [report ? report : r, updateReport] as const;
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

export const NavBarHeightContext = createContext<
  [number, React.Dispatch<React.SetStateAction<number>>] | undefined
>(undefined);
/**
 * A getter function which returns either the height of the nav bar or its setter
 *
 * @param setter Boolean of if we require the setter or the value of the height, true if we
 * want the setter and not the value
 * @returns The setter for useState if setter = true, else the height of the nav bar
 */
export const useNavBarHeightContext = function (setter = false) {
  const result = useContext(NavBarHeightContext);

  if (result === undefined) {
    throw new Error(
      "navBarHeight context was accessed without using the NavBarHeight Provider - navBarHeight was undefined."
    );
  }

  return setter ? result[1] : result[0];
};

/**
 * A getter function which returns either the text for the nav bar or its setter
 *
 * @param value Boolean of if we require the value or the setter of the height, true for if we
 * want the value instead of the setter
 * @returns The value for useState if value = true, else the setter for the text
 */
export const useNavBarTextContext = function (value = false) {
  // The reason for using value = false instead of setter = false as above is that the setter is just
  // used much more commonly as compared to the value, which is the opposite of above

  const result = useContext(NavBarTextContext);

  if (result === undefined) {
    throw new Error(
      "navBarText context was accessed without using the NavBarText Provider - navBarText was undefined."
    );
  }

  return value ? result[0] : result[1];
};

export const NavBarTextContext = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined);
