import Report from "../../classes/Report.js";
import Time from "../../classes/Time.js";
import PptxGenJS from "pptxgenjs";
import {
  dayjsToString,
  formatTimetoMinSec,
} from "./generateReportUtils/generateReportHelperFunctions";
// import { TableRow} from "./utils/types.js";

import {
  colors,
  tableHeaders,
  generalTableOptions,
  remarksTableOptions,
  laPhotoPositions,
  miniRemarksLAxpos,
} from "./generateReportUtils/newConstants";

// const getLATableData = function (
//   report: Report,
//   acesResponseTime: Time,
//   activationTime: Time,
// ): TableRow {
//   const { incidentInformation, acesInformation, generalInformation } = report;
//   const timeExceed = acesResponseTime.subtract(new Time(0, 8));
//   const tableData = [
//     { value: incidentInformation.incidentNumb, color: colors.black },
//     { value: dayjsToString(acesInformation.timeDispatched), color: colors.black },
//     { value: dayjsToString(acesInformation.timeArrived), color: colors.black },
//     { value: acesResponseTime.toString(), color: colors.red },
//     { value: timeExceed.toString(), color: colors.red },
//     { value: activationTime.minute < 1 ? "Y" : "N", color: colors.black },
//   ];

//     return tableData.map(({ value, color }) => ({
//       text: value,
//       options: { fontSize: 9, fill: colors.white, color },
//     }));
// };

const generateLaReport = async function (pptx: PptxGenJS, report: Report) {
  const {
    incidentInformation,
    acesInformation,
    generalInformation: _generalInformation,
    cameraInformation,
  } = report;

  const acesActivationTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeResponded
  );

  const actualActivationTime = Time.calculateTime(
    cameraInformation.timeDispatched,
    cameraInformation.timeMoveOff
  );

  let first = pptx.addSlide();
  let placeholderGen = [
    incidentInformation.incidentNumb,
    formatTimetoMinSec(acesActivationTime),
    formatTimetoMinSec(actualActivationTime),
  ].map((header, idx) => ({
    text: header,
    options: {
      fill: { color: colors.white },
      fontSize: 14,
      bold: true,
      color: idx === 1 || idx === 2 ? colors.red : colors.black,
    },
  }));
  let genImage = [""].map((header) => ({
    text: header,
    options: { fill: { color: colors.white }, colspan: 3 },
  }));

  first.addTable(
    [
      tableHeaders.generalTop("LA", incidentInformation.appliance),
      tableHeaders.general("LA"),
      placeholderGen,
      genImage,
    ],
    generalTableOptions
  );

  if (!incidentInformation.opsCenterAcknowledged) {
    first.addTable(
      [
        tableHeaders.remarks(
          `${incidentInformation.appliance} responded within 1 Min.`
        ),
      ],
      remarksTableOptions
    );

    const photoFields = [
      cameraInformation.dispatchPhoto,
      cameraInformation.allInPhoto,
      cameraInformation.moveOffPhoto,
    ];

    for (let i = 0; i < laPhotoPositions.length; i++) {
      const photo = photoFields[i];
      const base64Data = photo ? await photo.getBase64() : "";
      first.addImage({
        data: base64Data ?? "",
        x: laPhotoPositions[i],
        y: 2.039,
        w: 2.78,
        h: 2.61,
      });
    }

    for (let i = 0; i < miniRemarksLAxpos.length; i++) {
      let remarkText = "Time of call and coding received.";
      let timeValue = dayjsToString(cameraInformation.timeDispatched);
      if (i === 1) {
        remarkText = "Crew responding.";
        timeValue = dayjsToString(cameraInformation.timeAllIn);
      } else if (i === 2) {
        remarkText = "Appliance move off.";
        timeValue = dayjsToString(cameraInformation.timeMoveOff);
      }
      first.addText(
        [
          { text: "Remark: ", options: { bold: true } },
          { text: `${remarkText}\n` },
          { text: "Time: ", options: { bold: true } }, // @ts-ignore TS6133
          { text: `${timeValue}`, options: { bold: true, underline: "sng" } },
        ],
        {
          x: miniRemarksLAxpos[i],
          y: 4.57,
          h: 0.65,
          w: 3.98,
          fontSize: 10,
          color: colors.black,
          align: "left",
        }
      );
    }

    //hardcoded arrow positions because only 2 arrows are needed
    [4.7, 8.12].forEach((x) =>
      first.addShape(pptx.ShapeType.rightArrow, {
        x,
        y: 3.15,
        w: 0.47,
        h: 0.39,
        fill: { color: colors.blue },
      })
    );

    [4.7, 8.12].forEach((x) =>
      first.addShape(pptx.ShapeType.rightArrow, {
        x,
        y: 3.15,
        w: 0.47,
        h: 0.39,
        fill: { color: colors.blue },
      })
    );
    //hardcoded Resource Dispatched... etc... above photos
    ["Resource Dispatched", "Responding", "Resource Moved Off"].forEach(
      (text, i) =>
        first.addText([{ text }], {
          x: [2.18, 5.5, 8.7][i],
          y: 1.7,
          w: 2.5,
          h: 0.29,
          fontSize: 12,
          bold: true,
          color: colors.black,
          align: "center",
        })
    );
  } else {
    // first.addTable([tableHeaders.remarks(`Ops Centre Acknowledge Respond < 1 Min`)], remarksTableOptions);

    const screenshotData = acesInformation.acesScreenshot;
    const base64Data = screenshotData ? await screenshotData.getBase64() : "";

    first.addImage({
      data: base64Data ?? "",
      x: 3.47,
      y: 2.05,
      w: 6.47,
      h: 2.73,
    });
  }
};

export default generateLaReport;
