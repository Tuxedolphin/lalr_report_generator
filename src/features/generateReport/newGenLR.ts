import Report from "../../classes/Report.js";
import Time from "../../classes/Time";
import PptxGenJS from "pptxgenjs";
import { formatPage, dayjsToString } from "./generateReportUtils/generateReportHelperFunctions";
import { TableRow } from "./generateReportUtils/generateReportTypes";

import {
  colors,
  tableHeaders,
  lrFirstTableOptions,
  secondTableOptions,
  imagePositions,
  legendsTableDetails,
  generalTableOptions,
  remarksTableOptions,
  arrowPositions,
  remarksTimePositions,
  shortLongStation,
} from "./generateReportUtils/newConstants";

const getLRTableData = function (
  report: Report,
  acesResponseTime: Time,
  activationTime: Time,
  type: "First" | "Second"
): TableRow {
  const { incidentInformation, acesInformation, generalInformation } = report;

  if (type === "First") {
    const timeExceed = acesResponseTime.subtract(new Time(0, 8));
    const tableData = [
      { value: incidentInformation.incidentNumb, color: colors.black },
      {
        value: dayjsToString(acesInformation.timeDispatched),
        color: colors.black,
      },
      {
        value: dayjsToString(acesInformation.timeArrived),
        color: colors.black,
      },
      { value: acesResponseTime.toString(), color: colors.red },
      { value: timeExceed.toString(), color: colors.red },
      { value: activationTime.minute < 1 ? "Y" : "N", color: colors.black },
    ];

    return tableData.map(({ value, color }) => ({
      text: value,
      options: { fontSize: 9, fill: colors.white, color },
    }));
  } else if (type === "Second") {
    const tableData = [
      { value: incidentInformation.typeOfCall, color: colors.black },
      { value: incidentInformation.location, color: colors.black },
      { value: incidentInformation.appliance, color: colors.black },
      {
        value: `${generalInformation.boundary} Mins Boundary (${shortLongStation[incidentInformation.turnoutFrom]})`,
        color: colors.black,
      },
      {
        value: `${incidentInformation.SC} / ${incidentInformation.PO}`,
        color: colors.black,
        colspan: 2,
      },
    ];

    return tableData.map(({ value, color, colspan }) => ({
      text: value,
      options: {
        fontSize: 9,
        fill: colors.white,
        color,
        ...(colspan && { colspan }),
      },
    }));
  }

  throw new Error("Invalid type specified for getLRTableData");
};

const generateLrReport = function (pptx: PptxGenJS, report: Report) {
  const {
    incidentInformation,
    acesInformation,
    generalInformation,
  } = report;

  const acesResponseTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeArrived
  );

  const activationTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeEnRoute
  );

  // const cameraTimeEnRoute = new Time(cameraInformation.timeMoveOff).subtract(
  //   cameraInformation.bufferingTime
  //     ? new Time(cameraInformation.bufferingTime)
  //     : new Time(0, 0)
  // );

  // const cameraTimeDispatched = cameraTimeEnRoute.subtract(activationTime);

  // const cameraTotalTime = Time.calculateTime(
  //   cameraTimeDispatched,
  //   cameraInformation.timeArrived
  // );

  const first = formatPage(
    pptx,
    "LR",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "first"
  );

  const rowData = ["First", "Second"].map((type) =>
    getLRTableData(
      report,
      acesResponseTime,
      activationTime,
      type as "First" | "Second"
    )
  );

  const [firstRowData, secondRowData] = rowData;

  let bigLRImage = [""].map((header) => ({
    text: header,
    options: { colspan: 6, fill: { color: colors.white } },
  }));

  // Logic to add table for first page of LR
  first.addTable(
    [
      tableHeaders.LRfirst,
      firstRowData,
      tableHeaders.LRsecond,
      secondRowData,
      bigLRImage,
    ],
    lrFirstTableOptions
  );

  //Image for maps
  first.addImage({
    path: acesInformation.acesScreenshot?.image.src,
    x: 1.52,
    y: 1.285,
    w: 10.48,
    h: 3.43,
  });

  const lowerTableItems = [
    {
      label: "SFTL",
      selected: generalInformation.sftl.selected,
      remarks: generalInformation.sftl.remarks,
    },
    {
      label: "Traffic Congestion",
      selected: generalInformation.trafficCongestion.selected,
      remarks: generalInformation.trafficCongestion.remarks,
    },
    {
      label: "Inclement Weather",
      selected: generalInformation.inclementWeather.selected,
      remarks: generalInformation.inclementWeather.remarks,
    },
    {
      label: "ACES Route Deviation?",
      selected: generalInformation.acesRouteDeviation.selected,
      remarks: generalInformation.acesRouteDeviation.remarks,
    },
  ];

  const lowerTableRows = lowerTableItems.map((item) =>
    [
      item.label,
      item.selected ? "Y" : "N",
      item.selected ? item.remarks : "NIL",
    ].map((header) => ({
      text: header,
      options: { fill: { color: colors.white }, fontSize: 9 },
    }))
  );
  //let remarksLRGenerated = formatRemarks(activationTime,);

  const placeholderLR3_5 = ["Remarks", "TEMP"].map((header, index, array) => ({
    text: header,
    options:
      index === array.length - 1
        ? { fill: { color: colors.white }, colspan: 2, fontSize: 9 }
        : { fill: { color: colors.white }, fontSize: 9 },
  }));

  first.addTable(
    [tableHeaders.LRthird, ...lowerTableRows, placeholderLR3_5],
    secondTableOptions.LR
  );
  first.addTable(
    [tableHeaders.legends, ...legendsTableDetails.details],
    secondTableOptions.legends
  );

  let second = pptx.addSlide();
  let placeholderGen = ["", "", ""].map((header) => ({
    text: header,
    options: { fill: { color: colors.white }, fontSize: 14 },
  }));
  let genImage = [""].map((header) => ({
    text: header,
    options: { fill: { color: colors.white }, colspan: 3 },
  }));

  second.addTable(
    [
      tableHeaders.generalTop("LR", incidentInformation.appliance),
      tableHeaders.general("LR"),
      placeholderGen,
      genImage,
    ],
    generalTableOptions
  );
  second.addTable([tableHeaders.remarks], remarksTableOptions);

  arrowPositions.forEach((xpos) => {
    second.addImage({
      path: "./assets/arrow.png",
      x: xpos,
      y: 2.93,
      w: 0.29,
      h: 0.29,
    });
  });

  imagePositions.forEach((xpos) => {
    second.addImage({
      path: "./assets/arrow.png",
      x: xpos,
      y: 2.12,
      w: 2.16,
      h: 1.93,
    });
  });

  remarksTimePositions.forEach((xpos) => {
    second.addText(
      [
        { text: "Remark:", options: { bold: true, fontSize: 10 } },
        { text: "\nTime:", options: { bold: true, fontSize: 10 } },
      ],
      { x: xpos, y: 4.01, h: 0.75, w: 2.26, valign: "top", align: "left" }
    );
  });
};

export default generateLrReport;
