import Report from "../../classes/Report";
import pptxgenjs from "pptxgenjs";
import Background from "./assets/ppt_background.png";
import Header from "./assets/ppt_header.png";
import { checkIncNumber, generateAcronym } from "../../utils/generalFunctions";
import dayjs from "dayjs";
import { defaultJustification } from "../../utils/constants";
import Time from "../../classes/Time";
import { AcesInformationType } from "../../types/types";
import DrawnOnPicture from "../../classes/DrawnOnPicture";
import { OnlinePredictionSharp } from "@mui/icons-material";

// =========================================
//         Defining useful constants
// =========================================

const red = "#FF0000";
const black = "#000000";
const white = "#FFFFFF";
const grey = "#D8D8D8";

const enDash = "\u2013";

const shortFormToLongForm = {
  LA: "Late Activation",
  LR: "Late Response",
} as const;

const monthNames = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
] as const;

const topTableHeaders = {
  LR: [
    "S/N",
    "INCIDENT NO.",
    "APPL.",
    "INCIDENT LOCATION",
    "T-DISPATCHED",
    "T-ARRIVED",
    "RESPONSE TIME",
    "RESPONDING FROM",
    "FS\nBOUNDARY",
    "FP\nBOUNDARY",
    "JUSTIFICATION",
  ].map((header) => ({
    text: header,
    options: { bold: true, fill: { color: white } },
  })),
  LA: [
    "S/N",
    "INCIDENT NO.",
    "APPL.",
    "INCIDENT LOCATION",
    "T-DISPATCHED",
    "T-RESPONDED",
    "V2 ACTIVATION TIME",
    "RESPONDING FROM",
    "ACTIVATION TIME BAND",
    "JUSTIFIED ACTIVATION TIME",
  ].map((header) => ({
    text: header,
    options: { bold: true, fill: { color: white } },
  })),
} as const;

const defaultBorder = {
  type: "solid",
  pt: 1,
} as const;

const topTableCellSize = {
  LRColW: [0.3, 1.21, 0.75, 1.69, 1.06, 1.06, 1.3, 1.29, 1.04, 1.04, 2.28],
  LRColH: [0.4, 0.4],
  LAColW: [0.33, 1.09, 0.75, 1.69, 1.06, 1.06, 1.68, 1.68, 1.68, 1.68],
  LAColH: [0.59, 0.7],
}; // No const assertion as pptxgenjs is not happy with readonly arrays

const lowerTableHeaders = {
  LR: [
    "Appliance",
    "Type of Call",
    "Incident Location",
    "Time Dispatched",
    "Time Arrived",
    "Response Time",
    "Incident Outcome",
    "Weather",
    "Justification",
  ],

  LA: [
    "Appliance",
    "Type of Call",
    "Time Dispatched",
    "Time Responded",
    "Activation Timing",
    "Justification",
  ],
} as const;

const lowerTableCellFormat = {
  ColW: [2.02, 4.95],
  ColH: 0.3,
  x: 3.23,
};

const leftTableHeader: TableRow = ["S/N", "INCIDENT NO.", "APPL."].map(
  (header) => {
    return { text: header, options: { bold: true, fill: { color: white } } };
  }
);

const secondPageTableHeight = 1.98;

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

const opsCenterAcknowledgePhotoFormat = {
  h: 4.1,
  w: 6.15,
  x: 3.47,
  y: 2.08,
} as const;

// =========================================
//         Defining useful types
// =========================================

type TableCell =
  | { text: string; options?: Record<string, unknown> }
  | {
      text: { text: string; options?: Record<string, unknown> }[];
      options?: Record<string, unknown>;
    }
  | { image: { path: string }; options?: Record<string, unknown> };
type TableRow = TableCell[];

// =========================================
//         Generate PPT Functions
// =========================================

const generateReportPpt = async function (report: Report): Promise<number> {
  const pptx = new pptxgenjs();
  pptx.defineLayout({ name: "Widescreen", width: 13.33, height: 7.5 });
  pptx.theme = { headFontFace: "Calibri", bodyFontFace: "Calibri" };

  const { incidentInformation } = report;

  pptx.subject = `${JSON.stringify(incidentInformation.reportType)} Report ${incidentInformation.incidentNumb}`;

  pptx.layout = "Widescreen";

  const reportPromise =
    incidentInformation.reportType === "LA"
      ? generateLaReport(pptx, report)
      : generateLrReport(pptx, report);

  return reportPromise
    .catch((e: unknown) => {
      console.error(e);
      return Promise.resolve(); // We ignore the error and continue with report generation for the user
    })
    .then(() =>
      pptx.writeFile({
        fileName: `${incidentInformation.reportType ?? ""}_${incidentInformation.appliance}_${formatIncidentNumber(incidentInformation.incidentNumb)}`,
      })
    )
    .then(() => 1)
    .catch((e: unknown) => {
      throw e;
    });
};

const generateLrReport = async function (pptx: pptxgenjs, report: Report) {
  const {
    incidentInformation,
    acesInformation,
    cameraInformation,
    generalInformation,
  } = report;

  const opsCenterAcknowledged = !!incidentInformation.opsCenterAcknowledged;

  const acesResponseTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeArrived
  );

  const activationTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeEnRoute
  );

  const cameraTimeEnRoute = new Time(cameraInformation.timeMoveOff).subtract(
    cameraInformation.bufferingTime
      ? new Time(cameraInformation.bufferingTime)
      : new Time(0, 0)
  );

  const cameraTimeDispatched = cameraTimeEnRoute.subtract(activationTime);

  const cameraTotalTime = Time.calculateTime(
    cameraTimeDispatched,
    cameraInformation.timeArrived
  );

  const first = formatPage(
    pptx,
    "LR",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "first"
  );

  const topTableData = getTopLRTableData(
    report,
    acesResponseTime,
    cameraTotalTime
  );

  if (topTableData.length !== topTableHeaders.LR.length)
    throw new Error("First page's top table data and headers do not match");

  first.addTable([topTableHeaders.LR, topTableData], {
    colW: topTableCellSize.LRColW,
    rowH: topTableCellSize.LRColH,
    x: 0.16,
    y: 2.2,
    h: 3,
    align: "center",
    border: defaultBorder,
    fill: { color: grey },
    margin: 0,
  });

  const secondTableData = getLowerLRTableData(
    report,
    acesResponseTime,
    cameraTotalTime,
    cameraTimeDispatched
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (secondTableData.length !== lowerTableHeaders.LR.length)
    // For safety
    throw new Error("First page's lower data and headers do not match");

  first.addTable(
    mergeLowerTableDataHeader(lowerTableHeaders.LR, secondTableData),
    {
      colW: lowerTableCellFormat.ColW,
      rowH: lowerTableCellFormat.ColH,
      x: lowerTableCellFormat.x,
      y: 3.33,
      border: defaultBorder,
    }
  );

  const second = formatPage(
    pptx,
    "LR",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "second"
  );

  generateLeftTable(
    second,
    incidentInformation.incidentNumb,
    incidentInformation.appliance
  );

  if (opsCenterAcknowledged)
    generateOpsAcknowledgePhoto(
      second,
      acesInformation.drawnScreenshot ?? new DrawnOnPicture()
    );
  else
    generateRightTable(
      second,
      [
        (await acesInformation.acesScreenshot?.getCroppedBlob()) ?? new Blob(),
        (await cameraInformation.moveOffPhoto?.getCroppedBlob()) ?? new Blob(),
        (await cameraInformation.arrivedPhoto?.getCroppedBlob()) ?? new Blob(),
      ],
      generateLrRightTableData(
        report,
        activationTime,
        cameraTimeDispatched,
        cameraTimeEnRoute,
        cameraTotalTime
      )
    );
};
const generateLaReport = async function (pptx: pptxgenjs, report: Report) {
  const {
    incidentInformation,
    acesInformation,
    cameraInformation,
    generalInformation,
  } = report;

  const first = formatPage(
    pptx,
    "LA",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "first"
  );

  const second = formatPage(
    pptx,
    "LA",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "second"
  );
};

// =========================================
//      PPT Generator Helper Functions
// =========================================

const formatPage = function (
  pptx: pptxgenjs,
  reportType: "LA" | "LR",
  incNumber: string,
  station: string,
  page: "first" | "second"
): pptxgenjs.Slide {
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

const getTopLRTableData = function (
  report: Report,
  acesResponseTime: Time,
  totalTime: Time
): TableRow {
  const { incidentInformation, acesInformation, generalInformation } = report;
  const respondFromStation =
    incidentInformation.turnoutFrom.endsWith("station");

  return [
    "1",
    formatIncidentNumber(incidentInformation.incidentNumb),
    incidentInformation.appliance,
    incidentInformation.location,
    dayjsToString(acesInformation.timeDispatched),
    dayjsToString(acesInformation.timeArrived),
    acesResponseTime.toString(true),
    respondFromStation
      ? `STN${incidentInformation.station}`
      : generateAcronym(incidentInformation.turnoutFrom),
    respondFromStation
      ? `${generalInformation.boundary ?? "0"} MIN\n(STN${incidentInformation.station})`
      : "-",
    respondFromStation
      ? "-"
      : `${generalInformation.boundary ?? "0"} MIN\n(${generateAcronym(incidentInformation.turnoutFrom)})`,
    generalInformation.justification ??
      defaultJustification.LRpptShort(
        generalInformation.boundary ?? "0",
        !!incidentInformation.opsCenterAcknowledged,
        totalTime
      ),
  ].map((cell) => ({ text: cell }));
};

const getLowerLRTableData = function (
  report: Report,
  acesResponseTime: Time,
  cameraTotalTime: Time,
  cameraTimeDispatched: Time
) {
  const {
    incidentInformation,
    acesInformation,
    cameraInformation,
    generalInformation,
  } = report;

  const acknowledged = !!incidentInformation.opsCenterAcknowledged;

  return [
    `${incidentInformation.appliance} ${enDash} ${incidentInformation.SC}`,
    incidentInformation.typeOfCall,
    incidentInformation.location,
    formatAcesCameraTiming(
      dayjsToString(acesInformation.timeDispatched),
      acknowledged ? "" : cameraTimeDispatched.toString(true)
    ),
    formatAcesCameraTiming(
      dayjsToString(acesInformation.timeArrived),
      acknowledged ? "" : dayjsToString(cameraInformation.timeArrived)
    ),
    formatAcesCameraTiming(
      acesResponseTime.toString(),
      acknowledged ? "" : cameraTotalTime.toString()
    ),
    generalInformation.incidentOutcome,
    generalInformation.weather,
    generalInformation.justification ??
      defaultJustification.LRpptLong(
        generalInformation.boundary ?? "0",
        acknowledged,
        cameraTotalTime
      ),
  ] as const;
};

const getLowerLATableData = function (
  report: Report,
  acesResponseTime: Time,
  cameraResponseTime?: Time
) {
  const {
    incidentInformation,
    acesInformation,
    cameraInformation,
    generalInformation,
  } = report;

  const opsCenterAcknowledged = !!incidentInformation.opsCenterAcknowledged;

  return [
    `${incidentInformation.appliance} – ${incidentInformation.SC}`,
    incidentInformation.typeOfCall,
    formatAcesCameraTiming(
      dayjsToString(acesInformation.timeDispatched),
      dayjsToString(cameraInformation.timeDispatched),
      opsCenterAcknowledged
    ),
    formatAcesCameraTiming(
      dayjsToString(acesInformation.timeResponded),
      dayjsToString(cameraInformation.timeMoveOff),
      opsCenterAcknowledged
    ),
    formatAcesCameraTiming(
      acesResponseTime.toString(),
      cameraResponseTime?.toString() ?? "",
      opsCenterAcknowledged
    ),
    generalInformation.justification ?? "Network Busy",
  ] as const;
};

const mergeLowerTableDataHeader = function (
  headers: readonly string[],
  data:
    | ReturnType<typeof getLowerLATableData>
    | ReturnType<typeof getLowerLRTableData>
): TableRow[] {
  if (headers.length !== data.length)
    throw new Error("Headers and data do not match");

  // Create an array of rows for the table
  const tableRows = headers.map((header, index) => {
    const currentData = data[index] ?? "";

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

    return [{ text: header }, currentData as TableCell];
  });

  return tableRows;
};

const generateLeftTable = function (
  slide: pptxgenjs.Slide,
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

const generateRightTable = function (
  slide: pptxgenjs.Slide,
  images: [Blob, Blob, Blob],
  cellTexts: [TableCell, TableCell, TableCell]
) {
  const tableData = cellTexts.map((cell) => {
    return [{ text: "" }, cell];
  });

  if (tableData.length !== 3)
    throw new Error("Right table data and headers do not match");

  images.forEach((image, index) => {
    slide.addImage({
      path: URL.createObjectURL(image),
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

const generateLrRightTableData = function (
  report: Report,
  activationTime: Time,
  cameraTimeDispatched: Time,
  cameraTimeEnRoute: Time,
  totalTime: Time
): [TableCell, TableCell, TableCell] {
  const { incidentInformation, cameraInformation, acesInformation } = report;

  const bufferTime = cameraInformation.hasBufferTime
    ? new Time(cameraInformation.bufferingTime)
    : null;

  const cameraResponseTime = totalTime.subtract(activationTime);

  return [
    {
      text: [
        ...formatLabelTiming(
          "Dispatched",
          formatAcesCameraTiming(
            dayjsToString(acesInformation.timeDispatched),
            cameraTimeDispatched.toString(true)
          )
        ).text,
        { text: "\n" },
        ...formatLabelTiming(
          "Enroute",
          formatAcesCameraTiming(
            dayjsToString(acesInformation.timeEnRoute),
            cameraTimeEnRoute.toString(true)
          )
        ).text,
        { text: "\n" },
        ...formatLabelTiming(
          "Activation Time",
          {
            text: `${activationTime.minute ? activationTime.minute.toString() + " min" : ""} ${activationTime.second.toString()} sec`,
            options: { bold: true },
          },
          { bold: true }
        ).text,
      ],
    },
    {
      text: [
        {
          text: `${dayjsToString(cameraInformation.timeMoveOff)} ${enDash} ${incidentInformation.appliance} move out\n`,
        },
        {
          text: bufferTime
            ? `Buffering Time From Dispatch To Footage\n` +
              `-${bufferTime.minute ? " " + bufferTime.minute.toString() + " min" : ""} ${bufferTime.second.toString()} sec\n` +
              `Location\n` +
              `- Along ${incidentInformation.location}`
            : "",
          options: { bold: true },
        },
      ],
    },
    {
      text: [
        {
          text: `${dayjsToString(cameraInformation.timeArrived)} ${enDash} ${incidentInformation.appliance} arrived at scene\n`,
        },
        {
          text: `MVC footage ${enDash} ${cameraResponseTime.minute.toString()} min ${cameraResponseTime.second.toString()} sec\n\n`,
          options: { bold: true },
        },
        {
          text: `Total Time ${enDash} ${totalTime.minute.toString()} min ${totalTime.second.toString()} sec`,
          options: {
            bold: true,
            color: red,
          },
        },
      ],
    },
  ] as const;
};

const generateOpsAcknowledgePhoto = function (
  slide: pptxgenjs.Slide,
  image: DrawnOnPicture
) {

  const {h, w, x, y} = opsCenterAcknowledgePhotoFormat;

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
// =========================================
//             Helper Functions
// =========================================

const dayjsToString = function (day: dayjs.Dayjs | null) {
  return day ? day.format("HH:mm:ss") : "";
};

const formatAcesCameraTiming = function (
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

const formatLabelTiming = function (
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

const formatIncidentNumber = function (incidentNumber: string) {
  return incidentNumber.replace("/", "");
};

export default generateReportPpt;
