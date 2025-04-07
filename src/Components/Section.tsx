import React from "react";
import { Box, Typography, alpha, useTheme, Paper } from "@mui/material";
import { defaultPaperSx } from "../utils/constants";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  time?: string;
  id?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

const Section = ({
  id,
  title,
  children,
  icon,
  accentColor,
  time,
}: SectionProps) => {
  const theme = useTheme();
  const color = accentColor ?? theme.palette.primary.main;

  time = time ?? "0s";

  return (
    <Paper sx={{ ...defaultPaperSx(time, theme, color), height: "100%" }} id={id}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2.5,
          gap: 1.5,
        }}
      >
        {icon && (
          <Box
            sx={{
              height: 34,
              width: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1.5,
              bgcolor: alpha(color, 0.12),
              color,
            }}
          >
            {icon}
          </Box>
        )}
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            position: "relative",
            color: theme.palette.text.primary,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -6,
              left: 0,
              width: 45,
              height: 3,
              backgroundColor: color,
              borderRadius: 1,
            },
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box className="section-content" sx={{ width: "100%" }}>
        {children}
      </Box>
    </Paper>
  );
};

export default Section;
