import { FC, useEffect, useState, ReactNode } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Paper,
  Container,
  Stack,
  CircularProgress,
  Divider,
  Fade,
  Grow,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  History as HistoryIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  CheckCircleOutline,
  CancelOutlined as CancelOutlinedIcon,
  ReplayOutlined as ReplayOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { ReportGenerationStatusType } from "../../types/types";
import { useReportContext } from "../../context/contextFunctions";
import generateReportPpt from "../../features/generateReport/generateReport";
import ls from "../../features/LocalStorage";

interface DownloadPageProps {
  reportGenerationStatus: ReportGenerationStatusType;
  setReportGenerationStatus: React.Dispatch<
    React.SetStateAction<ReportGenerationStatusType>
  >;
}

const DownloadPage: FC<DownloadPageProps> = function ({
  reportGenerationStatus: generatingReport,
  setReportGenerationStatus: setGeneratingReport,
}) {
  const navigation = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [progress, setProgress] = useState(0);
  const [report] = useReportContext();

  useEffect(() => {
    if (generatingReport === "inProgress") {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          const diff = Math.random() * 15 + 5;
          return Math.min(oldProgress + diff, 95);
        });
      }, 80);

      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    } else if (generatingReport === "complete") {
      setProgress(100);
    } else {
      setProgress(0);
    }
  }, [generatingReport]);

  const onGenerateAnother = () => {
    ls.clear();
    setTimeout(() => {
      navigation("/add_entry");
    }, 0);
  };

  const onGoToHistory = () => {
    navigation("/history");
  };

  const onRegenerateReport = () => {
    setGeneratingReport("inProgress");
    generateReportPpt(report)
      .then(() => {
        setGeneratingReport("complete");
      })
      .catch(() => {
        setGeneratingReport("error");
      });
  };

  const renderProgressState = () => (
    <Fade in>
      <Box sx={{ mb: 2, position: "relative", zIndex: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          color="primary"
          fontWeight="500"
          sx={{ mb: 2 }}
        >
          Generating Your Report
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          component="p"
          sx={{ maxWidth: "85%", mx: "auto", mb: 4, lineHeight: 1.6 }}
        >
          Please wait while we process your report data...
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            my: 6,
            position: "relative",
          }}
        >
          <CircularProgress
            size={84}
            thickness={3.5}
            sx={{
              opacity: 0.9,
            }}
          />
          <Typography
            variant="h6"
            fontWeight="medium"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: theme.palette.text.primary,
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>

        <Box sx={{ mt: 4, px: { xs: 1, sm: 4 } }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              mb: 1.5,
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", opacity: 0.8 }}
          >
            This may take a few moments
          </Typography>
        </Box>
      </Box>
    </Fade>
  );

  const renderContent = () => {
    switch (generatingReport) {
      case "inProgress":
        return renderProgressState();
      case "complete":
      case "error": {
        const isError = generatingReport === "error";
        const sx = {
          fontSize: { xs: 72, sm: 84 },
          mb: 3,
          mt: 1,
          opacity: 0.9,
        };
        return (
          <Fade in timeout={800}>
            <div>
              <ContentSection
                title={
                  isError
                    ? "Report Generation Failed"
                    : "Report Generated Successfully"
                }
                description={
                  isError
                    ? "There was an error generating your report. Please try again."
                    : "Your report has been downloaded to your device and is ready to view."
                }
                icon={
                  isError ? (
                    <CancelOutlinedIcon sx={{ ...sx, color: "error.main" }} />
                  ) : (
                    <CheckCircleOutline sx={{ ...sx, color: "success.main" }} />
                  )
                }
                primaryAction={{
                  label: isError ? "Try Again" : "Download Again",
                  onClick: onRegenerateReport,
                  icon: isError ? <ReplayOutlinedIcon /> : <DownloadIcon />,
                }}
                onGenerateAnother={onGenerateAnother}
                onGoToHistory={onGoToHistory}
                isMobile={isMobile}
              />
            </div>
          </Fade>
        );
      }
      default:
        return (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Ready to generate a report
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onGenerateAnother}
              sx={{ mt: 2 }}
            >
              Get Started
            </Button>
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
      <Grow in timeout={500}>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5 },
            mt: { xs: 2, sm: 4 },
            borderRadius: 2,
            textAlign: "center",
            overflow: "hidden",
            position: "relative",
            background:
              generatingReport === "complete" || generatingReport === "error"
                ? `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 1)}, ${alpha(theme.palette.background.paper, 0.97)})`
                : theme.palette.background.paper,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          {(generatingReport === "complete" ||
            generatingReport === "error") && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background:
                  generatingReport === "error"
                    ? theme.palette.error.main
                    : theme.palette.success.main,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
          )}

          {renderContent()}
        </Paper>
      </Grow>
    </Container>
  );
};

const ContentSection: FC<{
  title: string;
  description: string;
  icon?: ReactNode;
  primaryAction?: { label: string; onClick: () => void; icon?: ReactNode };
  secondaryAction?: { label: string; onClick: () => void; icon?: ReactNode };
  showDivider?: boolean;
  showNextSteps?: boolean;
  titleColor?: "primary" | "error";
  onGenerateAnother: () => void;
  onGoToHistory: () => void;
  isMobile: boolean;
}> = ({
  title,
  description,
  icon,
  primaryAction,
  showDivider = true,
  showNextSteps = true,
  titleColor = "primary",
  onGenerateAnother,
  onGoToHistory,
  isMobile,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
          mt: 1,
        }}
      >
        {icon}
        <Typography
          variant="h4"
          gutterBottom
          color={titleColor}
          fontWeight="500"
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: "90%",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>

        {primaryAction && (
          <Button
            variant="text"
            startIcon={primaryAction.icon}
            sx={{
              mt: 2.5,
              borderRadius: 1.5,
              py: 1,
              px: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.07),
              },
            }}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </Button>
        )}
      </Box>

      {showDivider && (
        <Divider
          sx={{
            my: 3,
            opacity: 0.7,
          }}
        />
      )}

      {showNextSteps && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            color="text.primary"
            sx={{ fontWeight: 500, mb: 3 }}
          >
            What would you like to do next?
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3, mb: 1 }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onGenerateAnother}
              size={isMobile ? "large" : "medium"}
              disableElevation
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 1.5,
                fontWeight: 500,
                textTransform: "none",
                fontSize: "0.95rem",
                backgroundColor: theme.palette.primary.main,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {titleColor === "error"
                ? "Start Over"
                : "Generate Another Report"}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<HistoryIcon />}
              onClick={onGoToHistory}
              size={isMobile ? "large" : "medium"}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 1.5,
                fontWeight: 500,
                textTransform: "none",
                fontSize: "0.95rem",
                borderWidth: 1.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  borderWidth: 1.5,
                  transform: "translateY(-2px)",
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              View Report History
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default DownloadPage;
