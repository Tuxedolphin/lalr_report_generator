import Report from "../../classes/Report";
import pptxgenjs from "pptxgenjs";
import Background from "./assets/ppt_background.png";
import Header from "./assets/ppt_header.png";
import { checkIncNumber } from "../../utils/generalFunctions";
import dayjs from "dayjs";

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

const pptx = new pptxgenjs();
pptx.defineLayout({ name: "Widescreen", width: 13.33, height: 7.5 });

const generateReportPpt = function (report: Report) {
  pptx.subject = `${JSON.stringify(report.incidentInformation.reportType)} Report ${report.incidentInformation.incidentNumb}`;
  pptx.theme = { headFontFace: "Calibri", bodyFontFace: "Calibri" };

  pptx.layout = "Widescreen";

  formatPage(
    report.incidentInformation.reportType ?? "LA",
    report.incidentInformation.incidentNumb,
    report.incidentInformation.station
  );

  pptx
    .writeFile({ fileName: report.incidentInformation.incidentNumb })
    .catch((e: unknown) => {
      console.error(e);
    });
};

const formatPage = function (
  reportType: "LA" | "LR",
  incNumber: string,
  station: string
) {
  const day = checkIncNumber(incNumber) ?? dayjs();

  const slide = pptx.addSlide();
  slide.background = { path: Background };

  slide.addImage({ path: Header, h: 1.24, w: 12.95, x: 0.25, y: 0.38 });

  slide
    .addText("OPS", {
      h: 0.84,
      w: 1.48,
      x: 2.23,
      y: 0.45,
      fontSize: 44,
      bold: true,
      color: "#FFFFFF",
      shadow: {
        type: "outer",
        angle: 45,
        blur: 3,
        opacity: 0.57,
        offset: 3,
        color: "#000000",
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
      {
        h: 0.4,
        w: 4.92,
        x: 4.2,
        y: 1.59,
        align: "center",
        fontSize: 24,
        bold: true,
      }
    );

    return slide;
};

const generateLR = function (report: Report) {};
const generateLA = function (report: Report) {};

export default generateReportPpt;
