import { alpha, Theme } from "@mui/material/styles";

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

export const sectionFormatting = {
  mainGrid: {
    container: true,
    spacing: { xs: 1, md: 2 },
    columns: 2,
  },
  input: { xs: 2, md: 1 },
} as const;

export const paperSx = (accentColor: string, theme: Theme) => ({
  p: { xs: 2.5, sm: 3 },
  mb: 3,
  borderRadius: 2.5,
  background: alpha(theme.palette.background.paper, 0.8),
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.85)})`,
  backdropFilter: "blur(10px)",
  border: `1px solid ${alpha(accentColor, 0.15)}`,
  transition: "all 0.3s ease",
  boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
  "&:hover": {
    boxShadow: `0 6px 20px ${alpha(accentColor, 0.15)}`,
    background: alpha(theme.palette.background.paper, 0.9),
  },
});

// Common styles for all text fields and inputs
export const inputSx = (accentColor: string) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: `0 3px 8px ${alpha(accentColor, 0.12)}`,
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(accentColor, 0.15)}`,
    },
  },
  "& .MuiInputLabel-root": {
    transition: "color 0.2s ease",
    "&.Mui-focused": {
      fontWeight: 500,
    },
  },
  "& .MuiInputBase-input": {
    display: "flex",
  },
});

// Animation styles for fade-in with slide effect
export const fadeInAnimationSx = (delay = "0s") => ({
  animation: `fadeSlideIn 0.5s ${delay} both`,
  "@keyframes fadeSlideIn": {
    "0%": { opacity: 0, transform: "translateY(10px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
});

export const defaultPaperSx = (
  time: string,
  theme: Theme,
  accentColor: string
) => {
  return {
    ...paperSx(accentColor, theme),
    ...fadeInAnimationSx(time),
    width: "100%",
  } as const;
};

export const timingInputToPhoto = {
  timeDispatched: "dispatchPhoto",
  timeResponded: "moveOffPhoto",
  timeAllIn: "allInPhoto",
  timeMoveOff: "moveOffPhoto",
  timeArrived: "arrivedPhoto",
} as const;
