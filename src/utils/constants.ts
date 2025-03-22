import Time from "../classes/Time";

// Default grid formatting based on material design
export const gridFormatting = {
  mainGridFormat: {
    container: true,
    spacing: { xs: 2, md: 3 },
    columns: { xs: 4, sm: 8, md: 12 },
  },
  smallInput: {
    xs: 2,
    sm: 4,
    md: 4,
  },
  largeInput: {
    xs: 4,
    sm: 8,
    md: 8,
  },
} as const;

export const alternateGridFormatting = {
  mainGridFormat: {
    container: true,
    spacing: { xs: 2, md: 3 },
    columns: { xs: 2, sm: 6 },
  },
  smallInput: {
    xs: 2,
    sm: 2,
  },
  largeInput: {
    xs: 2,
    sm: 4,
  },
} as const;

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
