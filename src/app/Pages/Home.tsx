import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  alpha,
  useTheme,
  Grid2 as Grid,
  Fade,
  Avatar,
} from "@mui/material";
import {
  KeyboardArrowRight,
  History as HistoryIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { FC, ReactNode, useEffect } from "react";
import {
  useNavBarHeightContext,
  useNavBarTextContext,
} from "../../context/contextFunctions";
import { Link } from "react-router-dom";
import ls from "../../features/LocalStorage";
import { fadeInAnimationSx } from "../../utils/constants";

// Main Home Component
const Home: FC = function () {
  const NavHeight = useNavBarHeightContext() as number;
  const updateNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;
  const theme = useTheme();

  useEffect(() => {
    updateNavBarText("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewReport = () => {
    ls.clearWorkingOn();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        minHeight: `calc(100vh - ${NavHeight.toString()}px)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <HeroSection />

      {/* Action Cards Section */}
      <Box
        sx={{
          ...fadeInAnimationSx("0.1s"),
          mb: 4,
          p: 3,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.7),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.03)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 22,
              borderRadius: 1,
              background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              mr: 2,
            }}
          />
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              position: "relative",
            }}
          >
            Quick Actions
          </Typography>
        </Box>

        <Grid
          container
          spacing={3}
          sx={{
            ...fadeInAnimationSx("0.2s"),
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <ActionCard
              title="New LALR Report"
              description="Create a standardised report for Late Activation or Late Response incidents"
              icon={<AddIcon />}
              buttonText="Create New Report"
              linkTo="/add_entry"
              color="primary"
              onClick={handleNewReport}
              buttonVariant="contained"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <ActionCard
              title="Report History"
              description="Access, review and manage all your previously created reports"
              icon={<HistoryIcon />}
              buttonText="View History"
              linkTo="/history"
              color="warning"
              buttonVariant="outlined"
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

// HeroSection Component
interface HeroSectionProps {
  title?: string;
  icon?: ReactNode;
}

const HeroSection: FC<HeroSectionProps> = ({
  title = "LALR Report Generator",
  icon = <DescriptionIcon />,
}) => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          ...fadeInAnimationSx("0s"),
          mb: 4,
          py: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.background.paper, 0.5),
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -80,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.primary.main,
              0.15
            )}, transparent 70%)`,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.secondary.main,
              0.1
            )}, transparent 70%)`,
            zIndex: 0,
          }}
        />

        <Avatar
          sx={{
            width: 80,
            height: 80,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            mb: 3,
            "& svg": {
              fontSize: 40,
              color: theme.palette.primary.main,
            },
            boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            animation: "bounce 6s infinite ease-in-out",
            "@keyframes bounce": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
            },
          }}
        >
          {icon}
        </Avatar>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            position: "relative",
            zIndex: 1,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 3,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1,
            },
          }}
        >
          {title}
        </Typography>
      </Box>
    </Fade>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  buttonText: string;
  linkTo: string;
  color: "primary" | "warning" | "secondary" | "info" | "success" | "error";
  onClick?: () => void;
  buttonVariant?: "contained" | "outlined";
}

const ActionCard: FC<ActionCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  linkTo,
  color,
  onClick,
  buttonVariant = "contained",
}) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 2,
        background: alpha(theme.palette.background.paper, 0.8),
        border: `1px solid ${alpha(theme.palette[color].main, 0.08)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0 10px 20px ${alpha(theme.palette[color].main, 0.12)}`,
          background: alpha(theme.palette.background.paper, 0.95),
        },
        borderLeft: `4px solid ${theme.palette[color].main}`,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            theme.palette[color].main,
            0.03
          )}, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            bgcolor: alpha(theme.palette[color].main, 0.08),
            color: theme.palette[color].main,
            boxShadow: `0 2px 8px ${alpha(theme.palette[color].main, 0.15)}`,
            border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        {description}
      </Typography>

      <Box sx={{ mt: "auto" }}>
        <Button
          component={Link}
          to={linkTo}
          onClick={onClick}
          variant={buttonVariant}
          color={color}
          endIcon={<KeyboardArrowRight />}
          size="large"
          sx={{
            width: "100%",
            borderRadius: 2,
            py: 1.25,
            ...(buttonVariant === "contained"
              ? {
                  backgroundColor: theme.palette[color].main,
                  boxShadow: `0 3px 10px ${alpha(theme.palette[color].main, 0.2)}`,
                  "&:hover": {
                    backgroundColor: theme.palette[color].dark,
                    transform: "translateY(-2px)",
                    boxShadow: `0 5px 12px ${alpha(theme.palette[color].main, 0.3)}`,
                  },
                }
              : {
                  borderColor: alpha(theme.palette[color].main, 0.3),
                  color: theme.palette[color].main,
                  "&:hover": {
                    borderColor: theme.palette[color].main,
                    backgroundColor: alpha(theme.palette[color].main, 0.03),
                    transform: "translateY(-2px)",
                    boxShadow: `0 5px 12px ${alpha(theme.palette[color].main, 0.15)}`,
                  },
                }),
            transition: "all 0.2s ease",
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};

export default Home;
