import Report from "../classes/Report";
import { RefObject, SyntheticEvent } from "react";
import dayjs, { Dayjs } from "dayjs";

export const getItem = function (key: string): string {
  const result = localStorage.getItem(key);

  return result ?? "";
};

const capitalisedWords = ["ACES"] as const;

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

export const camelCaseToTitleCase = function (string: string): string {
  const result = string.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const timeToSeconds = function (minute: number, second: number) {
  return minute * 60 + second;
};

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

export const clearCanvas = function (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

export const setCanvasStroke = function (
  context: CanvasRenderingContext2D,
  color: string,
  width: number
) {
  context.strokeStyle = color;
  context.lineWidth = width;
};

export const getTotalTime = function (
  start: Dayjs,
  end: Dayjs,
  buffer?: Dayjs
) {
  return (start.diff(end) + (buffer ? buffer.millisecond() : 0)) / 100;
};

export const checkAndUpdateID = async function (report: Report) {
  if (report.id >= 0) return Promise.resolve(report);

  await report.addReportDB();
  return report;
};

export const calculateTime = function (
  start: Dayjs | null,
  end: Dayjs | null,
  buffer?: Dayjs | null
) {

  if (!start || !end) return { minutes: 0, seconds: 0 };

  let totalSeconds =
    end.hour() * 3600 +
    end.minute() * 60 +
    end.second() -
    (start.hour() * 3600 + start.minute() * 60 + start.second());

  // If end time is less than start time, it means we've crossed midnight
  if (totalSeconds < 0) {
    totalSeconds += 12 * 3600;
  }

  const minutes =
    Math.floor(totalSeconds / 60) + (buffer ? buffer.minute() : 0);
  const remainingSeconds = (totalSeconds % 60) + (buffer ? buffer.second() : 0);

  return { minutes, seconds: remainingSeconds };
};
