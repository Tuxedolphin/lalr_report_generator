import Time from "../../../classes/Time";

export const colors = {
  red: "#FF0000",
  black: "#000000",
  white: "#FFFFFF",
  grey: "#D8D8D8",
} as const;

const { white } = colors;

export const enDash = "\u2013";

export const shortFormToLongForm = {
  LA: "Late Activation",
  LR: "Late Response",
} as const;

export const monthNames = [
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

export const topTableHeaders = {
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
    "V2\nACTIVATION TIME",
    "RESPONDING\nFROM",
    "ACTIVATION\nTIME BAND",
    "JUSTIFIED\nACTIVATION TIME",
  ].map((header) => ({
    text: header,
    options: { bold: true, fill: { color: white } },
  })),
} as const;

export const defaultBorder = {
  type: "solid",
  pt: 1,
} as const;

const topTableCellSize = {
  LRColW: [0.3, 1.21, 0.75, 1.69, 1.06, 1.06, 1.3, 1.29, 1.04, 1.04, 2.28],
  LRColH: [0.4, 0.4],
  LAColW: [0.33, 1.09, 0.75, 1.69, 1.06, 1.06, 1.68, 1.68, 1.68, 1.68],
  LAColH: [0.59, 0.7],
};

const topTableCommonOptions = {
  x: 0.16,
  y: 2.2,
  align: "center",
  valign: "middle",
  border: defaultBorder,
  fill: { color: colors.grey },
  margin: 0,
} as const;

export const topTableOptions = {
  LR: {
    colW: topTableCellSize.LRColW,
    rowH: topTableCellSize.LRColH,
    h: 3,
    ...topTableCommonOptions,
  },
  LA: {
    colW: topTableCellSize.LAColW,
    rowH: topTableCellSize.LAColH,
    h: 1.29,
    ...topTableCommonOptions,
  },
};

export const lowerTableHeaders = {
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

export const lowerTableCellFormat = {
  ColW: [2.02, 4.95],
  ColH: 0.3,
  x: 3.23,
};

export const secondPageTableHeight = 1.98;

export const defaultJustification = {
  LA: "Network Busy",
  LR: (boundary: string) => {
    return `MVC < ${boundary} min (Justified by MVC Footage)`;
  },
  LRpptShort: (
    boundary: string,
    opsCenterAcknowledged: boolean,
    totalTime?: Time
  ) => {
    return opsCenterAcknowledged
      ? `MVC < ${boundary} min \n(Ops Center Acknowledged)`
      : `MVC: ${totalTime?.minute.toString() ?? "0"} min ${totalTime?.second.toString() ?? "0"} sec`;
  },
  LRpptLong: (boundary: string, opsCenterAcknowledged: boolean, time: Time) => {
    return opsCenterAcknowledged
      ? `Ops Center acknowledged appliance responded within ${boundary}min`
      : `Total Time — ${time.toString()}`;
  },
};
