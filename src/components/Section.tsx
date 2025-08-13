import { FC, ReactNode } from "react";
import {
  Paper,
  SxProps,
  Theme,
  Typography,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { paperSx } from "../utils/constants";

interface SectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  accentColor?: string;
  time?: string;
  id?: string;
  sx?: SxProps<Theme>;
}

const Section: FC<SectionProps> = function ({
  title,
  icon,
  children,
  accentColor,
  id,
  sx = {},
}) {
  const theme = useTheme();
  const color = accentColor ?? theme.palette.primary.main;

  return (
    <Paper
      id={id}
      sx={{
        ...paperSx(color, theme),
        mb: 3,
        // eslint-disable-next-line @typescript-eslint/no-misused-spread
        ...(typeof sx === "object" ? sx : {}),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
        }}
      >
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              p: 1,
              backgroundColor: alpha(color, 0.05),
              color: color,
              mr: 1.5,
              "& svg": {
                fontSize: "1.5rem",
              },
            }}
          >
            {icon}
          </Box>
        )}
        <Typography variant="h6" fontWeight={500}>
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );
};

export default Section;
