import { ReportValueTypes } from "../types/types.ts";

export function getItem(key: string): string {
  const result = localStorage.getItem(key);

  return result ? result : "";
}

const capitalisedWords = ["ACES"] as const;

export function titleCaseString(text: string): string {
  const words = text.split(" ");

  return words
    .map((word) => {
      if (word.toUpperCase() in capitalisedWords) {
        return word.toUpperCase();
      }
      return word[0].toUpperCase() + word.substring(1);
    })
    .join(" ");
}

export function camelCaseToTitleCase(string: string): string {
  const result = string.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function timeToSeconds(minute: number, second: number) {
  return minute * 60 + second
}