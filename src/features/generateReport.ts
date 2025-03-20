import Report from "../classes/Report";
import pptxgenjs from "pptxgenjs";

const generateReportPpt = function (report: Report) {
  const pptx = new pptxgenjs();

  pptx.subject = `${JSON.stringify(report.incidentInformation.reportType)} Report ${report.incidentInformation.incidentNumb}`;
  pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial" };

  pptx.defineLayout({ name: "A4", width: 7.5, height: 11 });
  pptx.layout = "A4";

  pptx.addSlide();

  pptx
    .writeFile({ fileName: report.incidentInformation.incidentNumb })
    .catch((e: unknown) => {
      console.error(e);
    });
};
export default generateReportPpt;
