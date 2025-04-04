import Report from "../classes/Report";
import { RefObject, SyntheticEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import ls from "../features/LocalStorage";
import {
  SetErrorsType,
  ReportKeys,
  ReportValueKeysType,
  UpdateReportType,
} from "../types/types";

const defaultReport = new Report();

// -------------------- String Manipulation --------------------

const capitalisedWords = ["ACES"] as const;

/**
 * Converts a string to title case, with special handling for specific words.
 *
 * @param text - The string to convert to title case
 * @returns The title-cased string
 */
export const titleCaseString = function (text: string): string {
  const words = text.split(" ");

  return words
    .map((word) => {
      if (word.toUpperCase() in capitalisedWords) {
        return word.toUpperCase();
      }
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
};

/**
 * Converts a camelCase string to Title Case by inserting spaces before capital letters.
 *
 * @param string - The camelCase string to convert
 * @returns The Title Cased string
 */
export const camelCaseToTitleCase = function (string: string): string {
  const result = string.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Generates an acronym from a multi-word string by taking the first letter of each word.
 *
 * @param text - The text to generate an acronym from
 * @returns The generated acronym in uppercase
 */
export const generateAcronym = function (text: string): string {
  if (!text) return "";

  const words = text.split(" ").filter((word) => word.length > 0);

  return words.map((word) => word[0].toUpperCase()).join("");
};

// -------------------- Time Utilities --------------------

/**
 * Converts minutes and seconds to total seconds.
 *
 * @param minute - The number of minutes
 * @param second - The number of seconds
 * @returns The total time in seconds
 */
export const timeToSeconds = function (minute: number, second: number) {
  return minute * 60 + second;
};

/**
 * Calculates the total time difference between two dayjs objects.
 *
 * @param start - The start time
 * @param end - The end time
 * @param buffer - Optional buffer time to add
 * @returns The total time difference in centiseconds (milliseconds/100)
 */
export const getTotalTime = function (
  start: Dayjs,
  end: Dayjs,
  buffer?: Dayjs
) {
  return (start.diff(end) + (buffer ? buffer.millisecond() : 0)) / 100;
};

/**
 * Validates an incident number against the format YYYYMMDD/XXXX.
 *
 * @param incNumber - The incident number to validate
 * @returns A dayjs object of the date if valid, null otherwise
 */
export const checkIncNumber = function (incNumber: string) {
  const regex = /^\d{8}\/\d{4}$/;
  if (!regex.test(incNumber)) {
    return null;
  }

  const day = dayjs(incNumber.split("/")[0], "YYYYMMDD");
  return !day.isValid() ? null : day;
};

// -------------------- Canvas Utilities --------------------

/**
 * Gets the offset coordinates of a mouse or touch event relative to a canvas element.
 *
 * @param event - The synthetic event (mouse or touch)
 * @param canvasRef - The reference to the canvas element
 * @returns An array containing the x and y coordinates
 */
export const getOffset = function (
  event: SyntheticEvent,
  canvasRef: RefObject<HTMLCanvasElement>
): [number, number] {
  if (!canvasRef.current) return [0, 0];

  const rect = canvasRef.current.getBoundingClientRect();
  const e = event.nativeEvent as MouseEvent | TouchEvent;

  const x = "touches" in e ? e.touches[0].clientX : e.clientX;
  const y = "touches" in e ? e.touches[0].clientY : e.clientY;

  const scaleX = canvasRef.current.width / rect.width;
  const scaleY = canvasRef.current.height / rect.height;

  return [(x - rect.left) * scaleX, (y - rect.top) * scaleY];
};

/**
 * Clears the entire canvas.
 *
 * @param context - The 2D rendering context of the canvas
 * @param canvas - The canvas element to clear
 */
export const clearCanvas = function (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Sets the stroke style and line width for canvas drawing.
 *
 * @param context - The 2D rendering context of the canvas
 * @param color - The color to set for the stroke
 * @param width - The width to set for the stroke
 */
export const setCanvasStroke = function (
  context: CanvasRenderingContext2D,
  color: string,
  width: number
) {
  context.strokeStyle = color;
  context.lineWidth = width;
};

// -------------------- Database Operations --------------------

/**
 * Checks if a report has an ID and updates it in the database if it doesn't.
 *
 * @param report - The report to check and update
 * @returns A promise that resolves to the report
 */
export const checkAndUpdateID = async function (report: Report) {
  if (report.id >= 0) return Promise.resolve(report);

  await report.addReportDB();
  return report;
};

// -------------------- Form Utilities --------------------

/**
 * Maps a field key to its parent section key in the report structure.
 *
 * @param key - The specific field key to look up
 * @returns The parent section key (e.g., 'personalInfo', 'companyInfo') or null if not found
 *
 * @remarks
 * This utility function searches through the report's keyToInfoKey mapping to determine
 * which section a particular field belongs to. This is necessary for correctly updating
 * the report structure and accessing values in the correct context.
 */
export const getReportKey = function (
  key: ReportValueKeysType
): ReportKeys | null {
  for (const [iKey, keys] of Object.entries(defaultReport.keyToInfoKey)) {
    if ((keys as ReportValueKeysType[]).includes(key)) {
      return iKey as ReportKeys;
    }
  }
  return null;
};

/**
 * Creates an onChange event handler function for form fields that updates the report state,
 * clears errors, and preserves cursor position after update.
 *
 * @param updateReport - Functions to update different sections of the report
 * @param setErrors - State setter function for form validation errors
 * @param key - The key identifying the specific field in the report
 * @param textFieldRefs - React ref object containing references to input elements
 * @returns A function that handles input change events
 *
 * @throws Will throw an error if the event object doesn't have target.value property
 */
export const getTextFieldOnChangeFn = function (
  updateReport: UpdateReportType,
  setErrors: SetErrorsType,
  key: ReportValueKeysType,
  textFieldRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>
) {
  const infoKey = getReportKey(key);
  if (!infoKey) throw new Error(`Key ${key} not found in keyToInfoKey mapping`);

  return (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.SyntheticEvent
      | null,
    value?: unknown
  ) => {
    if (!e) return;

    setErrors((prev) => ({ ...prev, [key]: "" }));

    let newValue;

    if (typeof value === "string") newValue = value;
    else if ("target" in e && "value" in e.target) newValue = e.target.value;
    else
      throw new Error(`Unexpected value type: ${typeof value} and ${typeof e}`);

    // Save cursor position before update
    const inputElement = textFieldRefs.current[key];
    const cursorPosition = inputElement?.selectionStart ?? 0;

    (updateReport[infoKey] as (k: ReportValueKeysType, v: string) => void)(
      key,
      newValue
    );

    // Restore cursor position after React updates the component
    setTimeout(() => {
      if (inputElement) {
        inputElement.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };
};

/**
 * Creates an onBlur event handler for form fields that performs validation
 * and updates the database report when appropriate.
 *
 * @param setErrors - State setter function for form validation errors
 * @param report - The report object containing the current form data
 * @param key - The key identifying the specific field in the report
 * @returns A function that handles blur events
 */
export const getTextFieldOnBlurFn = function (
  setErrors: SetErrorsType,
  report: Report,
  key: ReportValueKeysType
) {
  let fn: (value: string) => boolean;

  switch (key) {
    case "incidentNumb":
      fn = (value: string) => {
        if (!checkIncNumber(value)) {
          setErrors((prev) => ({
            ...prev,
            incidentNumb: "Please Make Sure it is in the Format YYYYMMDD/XXXX",
          }));
          return true;
        }

        setErrors((prev) => ({ ...prev, incidentNumb: "" }));
        return false;
      };
      break;
    case "typeOfCall":
      fn = (value: string) => {
        if (value && !/^[^\s-]+ - [^\s-]+$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            typeOfCall: "Please be in the format of 'Call - Type'",
          }));
          return false;
        }
        setErrors((prev) => ({ ...prev, typeOfCall: "" }));
        return true;
      };
      break;

    default:
      fn = () => {
        setErrors((prev) => ({ ...prev, [key]: "" }));
        return true;
      };
  }

  /**
   * Returns an onBlur event handler for form fields that performs validation
   * and updates the database report when appropriate.
   *
   * @param e - The blur event from the input field
   *
   * @remarks
   * This function retrieves the input value either from the event object or from
   * the report context if the event doesn't contain a value. It then applies
   * field-specific validation logic, updates the local storage to track the current
   * report being worked on, and conditionally updates the database report.
   */
  return (
    e:
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.SyntheticEvent
  ) => {
    // Get the value either from the target or from the report context
    let value: string;

    if ("target" in e && "value" in e.target) value = e.target.value;
    else {
      const infoKey = getReportKey(key);
      if (!infoKey)
        throw new Error(`Key ${key} not found in keyToInfoKey mapping`);
      value = report[infoKey][key as keyof (typeof report)[typeof infoKey]];
    }

    ls.setWorkingOn(report.id);
    if (fn(value)) report.updateDBReport("incidentInformation");
  };
};

export const getSelectOnChangeFn = function (
  updateReport: UpdateReportType,
  setErrors: SetErrorsType,
  key: "station" | "turnoutFrom",
  report: Report
) {
  const infoKey = getReportKey(key);
  if (!infoKey) throw new Error(`Key ${key} not found in keyToInfoKey mapping`);

  return (
    e:
      | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
      | React.SyntheticEvent,
    value?: unknown
  ) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));

    ls.setWorkingOn(report.id);

    let newValue: string;

    if (typeof value === "string") newValue = value;
    else if ("target" in e && "value" in e.target)
      newValue = e.target.value as string;
    else
      throw new Error(`Unexpected value type: ${typeof value} and ${typeof e}`);

    (updateReport[infoKey] as (k: ReportValueKeysType, v: string) => void)(
      key,
      newValue
    );

    report.updateDBReport("incidentInformation");
  };
};
