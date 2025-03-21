import Report from "../../classes/Report";
import pptxgenjs from "pptxgenjs";
import Background from "./assets/ppt_background.png";
import Header from "./assets/ppt_header.png";
import { checkIncNumber, generateAcronym } from "../../utils/generalFunctions";
import dayjs from "dayjs";
import { defaultJustification } from "../../utils/constants";
import Time from "../../classes/Time";
import { AcesInformationType } from "../../types/types";

// =========================================
//         Defining useful constants
// =========================================

const red = "#FF0000";
const black = "#000000";
const white = "#FFFFFF";

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

const topTableCellSize = {
  LRColW: [0.3, 1.21, 0.75, 1.69, 1.06, 1.06, 1.3, 1.29, 1.04, 1.04, 2.28],
  LRColH: [0.4, 0.4],
  LAColW: [0.33, 1.09, 0.75, 1.69, 1.06, 1.06, 1.68, 1.68, 1.68, 1.68],
  LAColH: [0.59, 0.7],
};

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

// =========================================
//         Defining useful types
// =========================================

type TableCell =
  | { text: string; options?: Record<string, unknown> }
  | {
      text: { text: string; options?: Record<string, unknown> }[];
      options?: Record<string, unknown>;
    };
type TableRow = TableCell[];

// =========================================
//         Generate PPT Functions
// =========================================

const generateReportPpt = function (report: Report) {
  const pptx = new pptxgenjs();
  pptx.defineLayout({ name: "Widescreen", width: 13.33, height: 7.5 });
  pptx.theme = { headFontFace: "Calibri", bodyFontFace: "Calibri" };

  pptx.subject = `${JSON.stringify(report.incidentInformation.reportType)} Report ${report.incidentInformation.incidentNumb}`;

  pptx.layout = "Widescreen";

  if (report.incidentInformation.reportType === "LA")
    generateLaReport(pptx, report);
  else generateLrReport(pptx, report);

  pptx
    .writeFile({ fileName: report.incidentInformation.incidentNumb })
    .catch((e: unknown) => {
      console.error(e);
    });
};

const formatPage = function (
  pptx: pptxgenjs,
  reportType: "LA" | "LR",
  incNumber: string,
  station: string,
  page: "first" | "second"
) {
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

const generateLrReport = function (pptx: pptxgenjs, report: Report) {
  const {
    incidentInformation,
    acesInformation,
    cameraInformation,
    generalInformation,
  } = report;

  const respondFromStation =
    incidentInformation.turnoutFrom.endsWith("station");

  const acesResponseTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeArrived
  );

  const activationTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeEnRoute
  );

  const cameraDispatchTime = new Time(cameraInformation.timeMoveOff).subtract(
    activationTime
  );

  const cameraResponseTime = Time.calculateTime(
    cameraDispatchTime,
    cameraInformation.timeArrived
  );

  const first = formatPage(
    pptx,
    "LR",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "first"
  );

  const topTableData = [
    "1",
    incidentInformation.incidentNumb,
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
        !!incidentInformation.opsCenterAcknowledged
      ),
  ].map((cell) => ({ text: cell }));

  if (topTableData.length !== topTableHeaders.LR.length)
    throw new Error("Top table on first page's data and headers do not match");

  first.addTable([topTableHeaders.LR, topTableData], {
    colW: topTableCellSize.LRColW,
    rowH: topTableCellSize.LRColH,
    h: 0.8,
    w: 13.03,
    x: 0.16,
    y: 2.2,
    align: "center",
    valign: "middle",
    border: {
      type: "solid",
      pt: 1,
    },
    fill: { color: "#D8D8D8" },
    margin: 0,
  });

  const secondTableData = getLowerLRTableData(
    report,
    acesResponseTime,
    cameraResponseTime,
    cameraDispatchTime
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (secondTableData.length !== lowerTableHeaders.LR.length)
    // For safety
    throw new Error("Lower table on first page's data and headers do not match");

  first.addTable(
    mergeLowerTableDataHeader(lowerTableHeaders.LR, secondTableData),
    {
      colW: lowerTableCellFormat.ColW,
      rowH: lowerTableCellFormat.ColH,
      h: 3.07,
      x: lowerTableCellFormat.x,
      y: 3.33,
      border: {
        type: "solid",
        pt: 1,
      },
    }
  );

  const second = formatPage(
    pptx,
    "LR",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "second"
  );
};
const generateLaReport = function (pptx: pptxgenjs, report: Report) {
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
//             Helper Functions
// =========================================

const dayjsToString = function (day: dayjs.Dayjs | null) {
  return day ? day.format("HH:mm:ss") : "";
};

const formatAcesCameraTiming = function (
  acesTiming: string,
  cameraTiming: string,
  isLaAndAcknowledged?: boolean
) {
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

const getLowerLRTableData = function (
  report: Report,
  acesResponseTime: Time,
  cameraResponseTime: Time,
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
    `${incidentInformation.appliance} — ${incidentInformation.SC}`,
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
      acknowledged ? "" : cameraResponseTime.toString()
    ),
    generalInformation.incidentOutcome,
    generalInformation.weather,
    generalInformation.justification ??
      defaultJustification.LRpptLong(
        generalInformation.boundary ?? "0",
        acknowledged,
        cameraResponseTime
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
    `${incidentInformation.appliance} — ${incidentInformation.SC}`,
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

export default generateReportPpt;
