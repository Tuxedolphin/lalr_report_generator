import { ReportValueTypes } from "../Classes/Report";

const capitalisedWords = ["ACES"];

export function getItem(key: string): string {
  return !localStorage.getItem(key) ? "" : localStorage.getItem(key)!;
}

export function titleCaseString(text: string): string {
  const words = text.split(" ");

  return words
    .map((word) => {
      if (capitalisedWords.includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
}

/**
 * A function for taking care of the value of inputs.
 * If the value does not exist, we return an empty string "".
 * @param value The value to be checked
 * @returns value is the value exists, else "".
 */
export function checkIfEmptyAndReturn(value: ReportValueTypes | undefined): Exclude<ReportValueTypes, null> {
  return value ? value : "";
}


export function camelCaseToTitleCase(string: string): string {
  const result = string.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Default grid formatting based on material design
export const gridFormatting = {
  mainGridFormat: {
    container: true,
    spacing: { xs: 2, md: 3 },
    columns: { xs: 4, sm: 8, md: 12 },
  },
  smallInput: {
    xs: 2,
    sm: 4,
    md: 4,
  },
  largeInput: {
    xs: 4,
    sm: 8,
    md: 8,
  },
} as const;
