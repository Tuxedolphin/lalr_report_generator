import Report from "../../classes/Report";
import Time from "../../classes/Time";
import PptxGenJS from "pptxgenjs";
import {
  formatPage,
  dayjsToString,
  formatAcesCameraTiming,
} from "./utils/helperFunctions";

export const generateLaReport = async function (
  pptx: PptxGenJS,
  report: Report
) {
  const { incidentInformation } = report;

  formatPage(
    pptx,
    "LA",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "first"
  );

  formatPage(
    pptx,
    "LA",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "second"
  );
};

export const getLowerLATableData = function (
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
