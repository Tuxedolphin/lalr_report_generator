import Report from "../../classes/Report";
import PptxGenJS from "pptxgenjs";
import generateLaReport from "./newGenLA";
import generateLrReport from "./newGenLR";
import { formatIncidentNumber } from "./utils/helperFunctions";

const generateReportPpt = async function (report: Report): Promise<number> {
  const pptx = new PptxGenJS();
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
export default generateReportPpt;
