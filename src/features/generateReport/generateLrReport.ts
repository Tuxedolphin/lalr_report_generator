import Report from "../../classes/Report";
import Time from "../../classes/Time";
import PptxGenJS from "pptxgenjs";
import {
  formatPage,
  dayjsToString,
  formatLabelTiming,
  generateLeftTable,
  generateOpsAcknowledgePhoto,
  generateRightTable,
  mergeLowerTableDataHeader,
  formatIncidentNumber,
  formatAcesCameraTiming,
} from "./utils/helperFunctions";
import {
  defaultBorder,
  enDash,
  colors,
  topTableHeaders,
  topTableOptions,
  lowerTableHeaders,
  lowerTableCellFormat,
  defaultJustification,
} from "./utils/constants";
import { generateAcronym } from "../../utils/helperFunctions";
import { TableRow, TableCell } from "./utils/types";
import DrawnOnPicture from "../../classes/DrawnOnPicture";

const { red } = colors;

const lowerTableOptions = {
  colW: lowerTableCellFormat.ColW,
  rowH: lowerTableCellFormat.ColH,
  x: lowerTableCellFormat.x,
  y: 3.33,
  border: defaultBorder,
};

const generateLrReport = async function (pptx: PptxGenJS, report: Report) {
  const { incidentInformation, acesInformation, cameraInformation } = report;

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

  first.addTable([topTableHeaders.LR, topTableData], topTableOptions.LR);

  const lowerTableData = getLowerLRTableData(
    report,
    acesResponseTime,
    cameraTotalTime,
    cameraTimeDispatched
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (lowerTableData.length !== lowerTableHeaders.LR.length)
    // For safety
    throw new Error("First page's lower data and headers do not match");

  first.addTable(
    mergeLowerTableDataHeader(lowerTableHeaders.LR, lowerTableData),
    lowerTableOptions
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
        (await acesInformation.acesScreenshot?.getBase64()) ?? "",
        (await cameraInformation.moveOffPhoto?.getBase64()) ?? "",
        (await cameraInformation.arrivedPhoto?.getBase64()) ?? "",
      ],
      getLrRightTableData(
        report,
        activationTime,
        cameraTimeDispatched,
        cameraTimeEnRoute,
        cameraTotalTime
      )
    );
};

const getTopLRTableData = function (
  report: Report,
  acesResponseTime: Time,
  totalTime: Time
): TableRow {
  const { incidentInformation, acesInformation, generalInformation } = report;
  const respondFromStation = incidentInformation.turnoutFrom
    .toLowerCase()
    .endsWith("station");

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

export const getLowerLRTableData = function (
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

const getLrRightTableData = function (
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

export default generateLrReport;
