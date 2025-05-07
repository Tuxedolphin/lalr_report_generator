import Report from "../../classes/Report";
import Time from "../../classes/Time";
import PptxGenJS from "pptxgenjs";
import {
  formatPage,
  dayjsToString,
  mergeLowerTableDataHeader,
  formatAcesCameraTiming,
  generateLeftTable,
  generateOpsAcknowledgePhoto,
  generateRightTable,
} from "./generateReportUtils/generateReportHelperFunctions";
import { TableCell } from "./generateReportUtils/generateReportTypes";
import {
  topTableHeaders,
  lowerTableHeaders,
  enDash,
  colors,
  topTableOptions,
  lowerTableCellFormat,
  defaultBorder,
} from "./generateReportUtils/generateReportConstants";
import { generateAcronym } from "../../utils/helperFunctions";
import DrawnOnPicture from "../../classes/DrawnOnPicture";

const { red } = colors;

const lowerTableOption = {
  colW: lowerTableCellFormat.ColW,
  rowH: lowerTableCellFormat.ColH,
  x: lowerTableCellFormat.x,
  y: 4,
  border: defaultBorder,
};

const generateLaReport = async function (pptx: PptxGenJS, report: Report) {
  const { incidentInformation, cameraInformation } = report;

  const acknowledged = !!incidentInformation.opsCenterAcknowledged;

  const acesActivationTime = Time.calculateTime(
    report.acesInformation.timeDispatched,
    report.acesInformation.timeResponded
  );

  const cameraActivationTime = Time.calculateTime(
    report.cameraInformation.timeDispatched,
    report.cameraInformation.timeMoveOff
  );

  const first = formatPage(
    pptx,
    "LA",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "first"
  );

  const topTableData = getTopLATableData(
    report,
    acesActivationTime,
    cameraActivationTime
  );

  if (topTableData.length !== topTableHeaders.LA.length)
    throw new Error("Top table data does not match top table headers");

  first.addTable([topTableHeaders.LA, topTableData], topTableOptions.LA);

  const lowerTableData = getLowerLATableData(
    report,
    acesActivationTime,
    cameraActivationTime
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (lowerTableData.length !== lowerTableHeaders.LA.length)
    throw new Error("Lower table data does not match lower table headers");

  first.addTable(
    mergeLowerTableDataHeader(lowerTableHeaders.LA, lowerTableData),
    lowerTableOption
  );

  const second = formatPage(
    pptx,
    "LA",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "second"
  );

  generateLeftTable(
    second,
    incidentInformation.incidentNumb,
    incidentInformation.appliance
  );

  if (acknowledged)
    generateOpsAcknowledgePhoto(
      second,
      report.acesInformation.drawnScreenshot ?? new DrawnOnPicture()
    );
  else
    generateRightTable(
      second,
      [
        (await cameraInformation.dispatchPhoto?.getBase64()) ?? "",
        (await cameraInformation.allInPhoto?.getBase64()) ?? "",
        (await cameraInformation.moveOffPhoto?.getBase64()) ?? "",
      ],
      getLaRightTableData(report, cameraActivationTime)
    );
};

const getTopLATableData = function (
  report: Report,
  acesActivationTime: Time,
  cameraActivationTime: Time
) {
  const { incidentInformation, acesInformation } = report;

  return [
    "1",
    incidentInformation.incidentNumb,
    incidentInformation.appliance,
    incidentInformation.location,
    dayjsToString(acesInformation.timeDispatched),
    dayjsToString(acesInformation.timeResponded),
    acesActivationTime.toString(true),
    incidentInformation.turnoutFrom.toLowerCase().endsWith("station")
      ? `STN${incidentInformation.station}`
      : generateAcronym(incidentInformation.turnoutFrom),
    getActivationTimeBand(acesActivationTime),
    incidentInformation.opsCenterAcknowledged
      ? "< 1 MIN\n(OPS CENTRE\nACKNOWLEDGED)"
      : cameraActivationTime.minute
        ? cameraActivationTime.minute.toString() + " min "
        : "" + `${cameraActivationTime.second.toString()} sec`,
  ].map((cell) => ({
    text: cell,
  }));
};

export const getLowerLATableData = function (
  report: Report,
  acesActivationTime: Time,
  cameraActivationTime: Time
) {
  const {
    incidentInformation,
    acesInformation,
    cameraInformation,
    generalInformation,
  } = report;

  const opsCenterAcknowledged = !!incidentInformation.opsCenterAcknowledged;

  return [
    `${incidentInformation.appliance} ${enDash} ${incidentInformation.SC}`,
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
      acesActivationTime.toString(),
      cameraActivationTime.toString(),
      opsCenterAcknowledged
    ),
    generalInformation.justification ?? "Network Busy",
  ] as const;
};

const getActivationTimeBand = function (activationTime: Time) {
  const totalSeconds = activationTime.totalSeconds;

  if (totalSeconds <= 60) {
    return "<=1min";
  } else {
    const minutes = Math.ceil(totalSeconds / 30) / 2;
    const previousBand = minutes - 0.5;
    return `>${previousBand.toString()}min<=${minutes.toString()}min`;
  }
};

const getLaRightTableData = function (
  report: Report,
  cameraActivationTime: Time
): [TableCell, TableCell, TableCell] {
  const { cameraInformation, incidentInformation } = report;

  return [
    formatTimingDescription(
      dayjsToString(cameraInformation.timeDispatched),
      "ACES coding activated"
    ),
    formatTimingDescription(
      dayjsToString(cameraInformation.timeAllIn),
      "All in"
    ),
    {
      text: [
        formatTimingDescription(
          dayjsToString(cameraInformation.timeMoveOff),
          `${incidentInformation.appliance} move off\n`
        ),
        {
          text:
            `Total Time ${enDash} ${cameraActivationTime.minute ? cameraActivationTime.minute.toString() + " min " : ""}` +
            `${cameraActivationTime.second.toString()} seconds`,
          options: { bold: true, color: red },
        },
      ],
    },
  ];
};

const formatTimingDescription = function (
  time: string,
  description: string
): { text: string; options: { bold: true } } {
  return {
    text: `${time} ${enDash} ${description}`,
    options: { bold: true },
  };
};

export default generateLaReport;
