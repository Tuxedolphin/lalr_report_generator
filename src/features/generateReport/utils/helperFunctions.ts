import dayjs from "dayjs";
import PptxGenJS from "pptxgenjs";
import {
  colors,
  enDash,
  shortFormToLongForm,
  monthNames,
  secondPageTableHeight,
  defaultBorder,
} from "./constants";
import { TableCell, TableRow } from "./types";
import DrawnOnPicture from "../../../classes/DrawnOnPicture";
import Background from "../assets/ppt_background.png";
import Header from "../assets/ppt_header.png";
import { checkIncNumber } from "../../../utils/helperFunctions";
import { getLowerLATableData } from "../generateLaReport";
import { getLowerLRTableData } from "../generateLrReport";

// =========================================
//            Useful Constants
// =========================================

const { red, black, white, grey } = colors;

const opsCenterAcknowledgePhotoFormat = {
  h: 4.1,
  w: 6.15,
  x: 3.47,
  y: 2.08,
} as const;

const leftTableFormat = {
  colW: [0.33, 1.09, 0.75],
  colH: [0.59, 0.7],
  h: 1.29,
  x: 0.51,
  y: secondPageTableHeight,
  border: defaultBorder,
  fill: { color: grey },
  margin: 0,
  valign: "middle" as const,
  align: "center" as const,
};

const rightTableFormat = {
  colH: 1.4,
  colW: [1.4 * (3 / 2), 7.87 - 1.4 * (3 / 2)],
  h: 1.4 * 3,
  x: 2.97,
  y: secondPageTableHeight,
  border: defaultBorder,
};

const leftTableHeader: TableRow = ["S/N", "INCIDENT NO.", "APPL."].map(
  (header) => {
    return { text: header, options: { bold: true, fill: { color: white } } };
  }
);

// =========================================
//       Ppt Generator Helper Functions
// =========================================

export const formatPage = function (
  pptx: PptxGenJS,
  reportType: "LA" | "LR",
  incNumber: string,
  station: string,
  page: "first" | "second"
): PptxGenJS.Slide {
  const day = checkIncNumber(incNumber) ?? dayjs();

  const slide = pptx.addSlide();

  // Adds the background image
  slide.background = { path: Background };

  // Adds the header image along with the texts
  slide.addImage({ path: Header, h: 1.24, w: 12.95, x: 0.25, y: 0.38 });

  slide
    .addText("OPS", {
      h: 0.84,
      w: 1.48,
      x: 2.23,
      y: 0.45,
      fontSize: 44,
      bold: true,
      color: white,
      shadow: {
        type: "outer",
        angle: 45,
        blur: 3,
        opacity: 0.57,
        offset: 3,
        color: black.replace("#", ""),
      },
    })
    .addText(`FRS ${shortFormToLongForm[reportType]}`, {
      h: 0.84,
      w: 8.3,
      x: 4.13,
      y: 0.51,
      align: "center",
      fontSize: 44,
      bold: true,
    })
    .addText(
      `${monthNames[day.month()]} ${day.year().toString()} (STATION ${station})`,
      page === "first"
        ? {
            h: 0.4,
            w: 4.92,
            x: 4.2,
            y: 1.59,
            align: "center",
            fontSize: 24,
            bold: true,
          }
        : {
            h: 0.4,
            w: 4.92,
            x: 4.2,
            y: 1.56,
            align: "center",
            fontSize: 24,
            bold: true,
          }
    );

  return slide;
};

export const generateOpsAcknowledgePhoto = function (
  slide: PptxGenJS.Slide,
  image: DrawnOnPicture
) {
  const { h, w, x, y } = opsCenterAcknowledgePhotoFormat;

  slide.addImage({
    path: image.image.src,
    h,
    w,
    x,
    y,
  });

  const [[x1, y1], [x2, y2]] = [image.start, image.end];

  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  const startX = Math.min(x1, x2);
  const startY = Math.min(y1, y2);

  // Add the rectangle shape based on the two corner points
  slide.addShape("rect", {
    x: x + (startX / image.image.width) * w,
    y: y + (startY / image.image.height) * h,
    w: (width / image.image.width) * w,
    h: (height / image.image.height) * h,
    line: { color: red, width: 2 },
  });
};

export const mergeLowerTableDataHeader = function (
  headers: readonly string[],
  data:
    | ReturnType<typeof getLowerLATableData>
    | ReturnType<typeof getLowerLRTableData>
): TableRow[] {
  if (headers.length !== data.length)
    throw new Error("Headers and data do not match");

  // Create an array of rows for the table
  const tableRows = headers.map((header, index) => {
    const currentData = data[index];

    // The data for appliance and justification is always a string
    if (header.toLowerCase() === "appliance")
      return [
        { text: header, options: { bold: true } },
        { text: currentData as string, options: { bold: true } },
      ];

    if (header.toLowerCase() === "justification")
      return [
        { text: header, options: { bold: true, color: red } },
        { text: currentData as string, options: { bold: true, color: red } },
      ];

    if (typeof currentData === "string")
      return [{ text: header }, { text: currentData }];

    return [{ text: header }, currentData] as TableRow;
  });

  return tableRows;
};

export const generateLeftTable = function (
  slide: PptxGenJS.Slide,
  incidentNumber: string,
  appliance: string
) {
  const tableData = ["1", formatIncidentNumber(incidentNumber), appliance].map(
    (cell) => ({
      text: cell,
    })
  );

  if (tableData.length !== leftTableHeader.length)
    throw new Error("Left table data and headers do not match");

  slide.addTable([leftTableHeader, tableData], {
    ...leftTableFormat,
  });
};

export const generateRightTable = function (
  slide: PptxGenJS.Slide,
  images: [string, string, string],
  cellTexts: [TableCell, TableCell, TableCell]
) {
  const tableData = cellTexts.map((cell) => {
    return [{ text: "" }, cell];
  });

  if (tableData.length !== 3)
    throw new Error("Right table data and headers do not match");

  images.forEach((image, index) => {
    slide.addImage({
      data: image,
      h: rightTableFormat.colH,
      w: rightTableFormat.colW[0],
      x: rightTableFormat.x,
      y: rightTableFormat.y + rightTableFormat.colH * index,
    });
  });

  slide.addTable(tableData, {
    ...rightTableFormat,
  });
};

// =========================================
//         General Helper Functions
// =========================================

export const dayjsToString = function (day: dayjs.Dayjs | null) {
  return day ? day.format("HH:mm:ss") : "";
};

export const formatLabelTiming = function (
  label: string,
  timing: TableCell | string,
  labelOptions?: Record<string, unknown>
) {
  if (typeof timing === "string") timing = { text: timing };

  if ("image" in timing) throw new Error("Cannot have an image in the timing");

  return {
    text: [
      { text: `${label} ${enDash} `, options: labelOptions },
      ...(Array.isArray(timing.text)
        ? timing.text
        : [
            typeof timing.text === "string"
              ? { text: timing.text }
              : timing.text,
          ]),
    ],
  };
};

export const formatAcesCameraTiming = function (
  acesTiming: string,
  cameraTiming: string,
  isLaAndAcknowledged?: boolean
): TableCell {
  if (!cameraTiming) {
    return { text: acesTiming, options: { color: black } };
  }

  return {
    text: [
      { text: `${acesTiming} / `, options: { color: black } },
      {
        text: isLaAndAcknowledged ? "< 1min" : cameraTiming,
        options: { color: red, bold: true },
      },
    ],
  };
};

export const formatIncidentNumber = function (incidentNumber: string) {
  return incidentNumber.replace("/", "");
};
