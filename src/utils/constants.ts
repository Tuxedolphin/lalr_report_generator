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
    return `Total Time < ${boundary} (justified by MVC footage)`;
  },
};
