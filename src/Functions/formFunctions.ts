import { type Crop } from "react-image-crop";

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

