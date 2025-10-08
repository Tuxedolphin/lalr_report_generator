import Report from "../../classes/Report.js";
import Time from "../../classes/Time";
import PptxGenJS from "pptxgenjs";
import Arrow from "./assets/arrow.png";
import { formatPage, dayjsToString } from "./generateReportUtils/generateReportHelperFunctions";
import { TableRow } from "./generateReportUtils/generateReportTypes";
import { Dayjs } from "dayjs";

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

// Helper function to create table cell options
const createTableCell = (text: string, options: Record<string, unknown> = {}) => ({
  text,
  options: { fill: { color: colors.white }, fontSize: 9, ...options },
});

// Calculate delay duration string
const getDelayDurationString = (startTime: Dayjs | undefined, endTime: Dayjs | undefined): string => {
  const delayDuration = endTime?.diff(startTime, "seconds") ?? 0;
  const minutes = Math.floor(delayDuration / 60);
  const seconds = delayDuration % 60;
  return `Delay Duration: ${minutes > 0 ? `${minutes}m ` : ""}${seconds}s`;
};

// Add image to slide
const addSlideImage = async (slide: any, photo: any, position: number) => {
  const base64Data = photo ? await photo.getBase64() : "";
  slide.addImage({
    data: base64Data ?? "",
    x: imagePositions[position],
    y: 2.12,
    w: 2.16,
    h: 1.93,
  });
};

// Add arrow to slide
const addArrow = (slide: any, position: number) => {
  slide.addImage({
    path: Arrow,
    x: arrowPositions[position],
    y: 2.93,
    w: 0.29,
    h: 0.29,
  });
};

// Add remark text to slide
const addRemarkText = (
  slide: any,
  remark: string,
  time: string,
  position: number,
  delayString: string = ""
) => {
  slide.addText(
    [
      { text: "Remark: ", options: { bold: true, fontSize: 10 } },
      { text: remark, options: { fontSize: 10, bold: false, breakLine: true } },
      { text: "Time: ", options: { bold: true, fontSize: 10 } },
      { text: time, options: { fontSize: 10, bold: false, breakLine: true } },
      { text: delayString, options: { fontSize: 10, bold: true, color: colors.red } },
    ],
    { x: remarksTimePositions[position], y: 4.01, h: 0.75, w: 2.26, valign: "top", align: "left" }
  );
};

// Setup justification slide header
const setupJustificationSlide = (
  slide: any,
  incidentNumb: string,
  acesResponseTime: Time,
  actualResponseTime: Time,
  appliance: string
) => {
  const placeholderGen = [incidentNumb, acesResponseTime.toString(), actualResponseTime.toString()].map((header) =>
    createTableCell(header, { fontSize: 14 })
  );
  const genImage = [createTableCell("", { colspan: 3 })];

  slide.addTable(
    [
      tableHeaders.generalTop("LR", appliance),
      tableHeaders.general("LR"),
      placeholderGen,
      genImage,
    ],
    generalTableOptions
  );
  slide.addTable([tableHeaders.remarks("Some details")], remarksTableOptions);
};

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
      { value: dayjsToString(acesInformation.timeDispatched), color: colors.black },
      { value: dayjsToString(acesInformation.timeArrived), color: colors.black },
      { value: acesResponseTime.toString(), color: colors.red },
      { value: timeExceed.toString(), color: colors.red },
      { value: activationTime.minute < 1 ? "Y" : "N", color: colors.black },
    ];

    return tableData.map(({ value, color }) => ({
      text: value,
      options: { fontSize: 9, fill: colors.white, color },
    }));
  } else {
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
};

const generateLrReport = async function (pptx: PptxGenJS, report: Report) {
  const { incidentInformation, acesInformation, generalInformation, cameraInformation } = report;

  const acesResponseTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeArrived
  );

  const activationTime = Time.calculateTime(
    acesInformation.timeDispatched,
    acesInformation.timeEnRoute
  );

  const actualResponseTime = Time.calculateTime(
    cameraInformation.timeMoveOff,
    cameraInformation.timeArrived
  );

  const first = formatPage(
    pptx,
    "LR",
    incidentInformation.incidentNumb,
    incidentInformation.station,
    "first"
  );

  const [firstRowData, secondRowData] = ["First", "Second"].map((type) =>
    getLRTableData(report, acesResponseTime, activationTime, type as "First" | "Second")
  );

  const bigLRImage = [createTableCell("", { colspan: 6 })];

  first.addTable(
    [tableHeaders.LRfirst, firstRowData, tableHeaders.LRsecond, secondRowData, bigLRImage],
    lrFirstTableOptions
  );

  first.addImage({
    path: acesInformation.acesScreenshot?.image.src,
    x: 1.52,
    y: 1.285,
    w: 10.48,
    h: 3.43,
  });

  const lowerTableItems = [
    { label: "SFTL", ...generalInformation.sftl },
    { label: "Traffic Congestion", ...generalInformation.trafficCongestion },
    { label: "Inclement Weather", ...generalInformation.inclementWeather },
    { label: "ACES Route Deviation?", ...generalInformation.acesRouteDeviation },
  ];

  const lowerTableRows = lowerTableItems.map((item) =>
    [item.label, item.quantity > 0 ? "Y" : "N", item.quantity > 0 ? item.remarks : "NIL"].map((text) =>
      createTableCell(text)
    )
  );

  const placeholderLR3_5 = [
    createTableCell("Remarks"),
    createTableCell("TEMP", { colspan: 2 }),
  ];

  first.addTable(
    [tableHeaders.LRthird, ...lowerTableRows, placeholderLR3_5],
    secondTableOptions.LR
  );
  first.addTable(
    [tableHeaders.legends, ...legendsTableDetails.details],
    secondTableOptions.legends
  );

  // Handle justification slides
  if (cameraInformation.justifications?.length === 1) {
    await renderSingleJustificationSlide(pptx, report, acesResponseTime, actualResponseTime);
  } else {
    await renderMultipleJustificationSlides(pptx, report, acesResponseTime, actualResponseTime);
  }
};

// Render single justification slide
const renderSingleJustificationSlide = async (
  pptx: PptxGenJS,
  report: Report,
  acesResponseTime: Time,
  actualResponseTime: Time
) => {
  const { incidentInformation, cameraInformation } = report;
  const justification = cameraInformation.justifications![0];
  const slide = pptx.addSlide();

  setupJustificationSlide(slide, incidentInformation.incidentNumb, acesResponseTime, actualResponseTime, incidentInformation.appliance);

  const images = [
    cameraInformation.moveOffPhoto,
    justification.photos[0],
    justification.photos[1],
    cameraInformation.arrivedPhoto,
  ];

  const remarks = [
    "Moving Off",
    justification.remarks,
    "Moving Off",
    "Arrived at the scene",
  ];

  const times = [
    dayjsToString(cameraInformation.timeMoveOff),
    dayjsToString(justification.timings[0]),
    dayjsToString(justification.timings[1]),
    dayjsToString(cameraInformation.timeArrived),
  ];

  for (let i = 0; i < images.length; i++) {
    await addSlideImage(slide, images[i], i);
    if (i < 3) addArrow(slide, i);

    const delayString = i === 2
      ? getDelayDurationString(justification.timings[0] ?? undefined, justification.timings[1] ?? undefined)
      : "";

    addRemarkText(slide, remarks[i], times[i], i, delayString);
  }
};

// Render multiple justification slides
const renderMultipleJustificationSlides = async (
  pptx: PptxGenJS,
  report: Report,
  acesResponseTime: Time,
  actualResponseTime: Time
) => {
  const { incidentInformation, cameraInformation } = report;
  const justifications = cameraInformation.justifications ?? [];

  for (const [idx, justification] of justifications.entries()) {
    const slide = pptx.addSlide();
    setupJustificationSlide(slide, incidentInformation.incidentNumb, acesResponseTime, actualResponseTime, incidentInformation.appliance);

    const isFirst = idx === 0;
    const isLast = idx === justifications.length - 1;

    if (isFirst) {
      await renderFirstJustification(slide, cameraInformation, justification);
    } else {
      await renderSubsequentJustification(slide, justification);
    }

    if (isLast) {
      await renderLastJustificationElements(slide, cameraInformation);
    }
  }
};

// Render first justification content
const renderFirstJustification = async (slide: any, cameraInfo: any, justification: any) => {
  const images = [cameraInfo.moveOffPhoto, justification.photos[0], justification.photos[1]];
  const remarks = ["Moving Off", justification.remarks, "Moving Off"];
  const times = [
    dayjsToString(cameraInfo.timeMoveOff),
    dayjsToString(justification.timings[0]),
    dayjsToString(justification.timings[1]),
  ];

  for (let i = 0; i < images.length; i++) {
    await addSlideImage(slide, images[i], i);
    if (i < 2) addArrow(slide, i);

    const delayString = i === 2
      ? getDelayDurationString(justification.timings[0], justification.timings[1])
      : "";

    addRemarkText(slide, remarks[i], times[i], i, delayString);
  }
};

// Render subsequent justification content
const renderSubsequentJustification = async (slide: any, justification: any) => {
  const images = [justification.photos[0], justification.photos[1]];
  const remarks = [justification.remarks, "Moving Off"];
  const times = [
    dayjsToString(justification.timings[0]),
    dayjsToString(justification.timings[1]),
  ];

  for (let i = 0; i < images.length; i++) {
    await addSlideImage(slide, images[i], i + 1);

    const delayString = i === 1
      ? getDelayDurationString(justification.timings[0] ?? undefined, justification.timings[1] ?? undefined)
      : "";

    addRemarkText(slide, remarks[i], times[i], i + 1, delayString);
  }

  addArrow(slide, 1);
};

// Render last justification elements (arrived photo)
const renderLastJustificationElements = async (slide: any, cameraInfo: any) => {
  addArrow(slide, 2);
  await addSlideImage(slide, cameraInfo.arrivedPhoto, 3);
  addRemarkText(slide, "Arrived at the scene", dayjsToString(cameraInfo.timeArrived), 3);
};

export default generateLrReport;