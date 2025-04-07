import { FC, useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Container,
  Card,
  CardContent,
  Chip,
  Grid2 as Grid,
  Fade,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  Stack,
  IconButton as MuiIconButton,
  Divider,
  CircularProgress,
  useMediaQuery,
  SxProps,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add as AddIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  AssignmentOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNavBarTextContext } from "../../context/contextFunctions";
import { retrieveAll, deleteReport } from "../../features/db";
import ls from "../../features/LocalStorage";
import { DisplayReportDataType } from "../../types/types";
import { fadeInAnimationSx, paperSx } from "../../utils/constants";

// Animation style constants
const ANIMATION_STYLES = {
  fadeIn: {
    "@keyframes fadeIn": {
      "0%": { opacity: 0, transform: "translateY(-5px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  },
  slideIn: {
    "@keyframes slideIn": {
      "0%": { opacity: 0, transform: "translateX(-5px)" },
      "100%": { opacity: 1, transform: "translateX(0)" },
    },
  },
  fadeSlideIn: {
    "@keyframes fadeSlideIn": {
      "0%": { opacity: 0, transform: "translateY(10px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
  },
};

// Animation style function that returns style with timing
const getFadeSlideInAnimation = (delay: string) => ({
  animation: `fadeSlideIn 0.5s ${delay} both`,
  ...ANIMATION_STYLES.fadeSlideIn,
});

interface SortedDisplayReportDataType {
  LA: DisplayReportDataType[];
  LR: DisplayReportDataType[];
  NoReportType: DisplayReportDataType[];
}

const History: FC = function () {
  const theme = useTheme();
  const [reports, setReports] = useState<SortedDisplayReportDataType>({
    LA: [],
    LR: [],
    NoReportType: [],
  });
  const [loading, setLoading] = useState(true);

  const updateNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await retrieveAll();
        const sortedData: SortedDisplayReportDataType = {
          LA: [],
          LR: [],
          NoReportType: [],
        };
        data.forEach((report) => {
          switch (report.reportType) {
            case "LA":
              sortedData.LA.push(report);
              break;
            case "LR":
              sortedData.LR.push(report);
              break;
            default:
              sortedData.NoReportType.push(report);
              break;
          }
        });

        setReports(sortedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    updateNavBarText("Report History");
    fetchReports().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const handleDelete = (report: DisplayReportDataType) => () => {
    const newReports = { ...reports };

    const reportType = report.reportType ?? "NoReportType";

    const index = newReports[reportType].indexOf(report);
    if (index < 0) return;

    newReports[reportType].splice(index, 1);
    setReports(newReports);

    deleteReport(report.id);
  };

  const isEmpty =
    reports.LA.length === 0 &&
    reports.LR.length === 0 &&
    reports.NoReportType.length === 0;

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          ...fadeInAnimationSx("0s"),
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3, color: "text.secondary" }}>
          Loading reports...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {isEmpty ? (
        <Fade in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              textAlign: "center",
              ...paperSx(theme.palette.primary.main, theme),
              ...fadeInAnimationSx("0.1s"),
              position: "relative",
              p: 4,
              pt: 5,
              borderRadius: 2,
              overflow: "hidden",
              borderTop: `4px solid ${theme.palette.primary.main}`,
              boxShadow: `0 6px 20px ${alpha(theme.palette.common.black, 0.1)}`,
              background:
                theme.palette.mode === "dark"
                  ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`
                  : `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(theme.palette.background.default, 0.98)})`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  mb: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <HistoryIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography
                variant="h5"
                component="h2"
                color="text.primary"
                fontWeight={600}
                sx={{
                  position: "relative",
                  pb: 2,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 60,
                    height: 3,
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1,
                  },
                }}
              >
                No Reports Available
              </Typography>
            </Box>
            <Typography
              variant="body1"
              color="text.secondary"
              component="p"
              sx={{ mb: 4, maxWidth: 450, mx: "auto", lineHeight: 1.6 }}
            >
              Your report history is currently empty. Create your first Late
              Activation or Late Response report to begin tracking incidents.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/add_entry");
              }}
              sx={{
                py: 1.2,
                px: 4,
                borderRadius: 2,
                fontWeight: 500,
                boxShadow: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                },
              }}
              aria-label="add report"
              startIcon={<AddIcon />}
              size="large"
            >
              Create New Report
            </Button>
          </Paper>
        </Fade>
      ) : (
        <Fade in={true} timeout={500}>
          <Box>
            <SectionOverview
              header="Late Activation"
              reports={reports.LA}
              handleDelete={handleDelete}
              chipColor={theme.palette.error.main}
              animationDelay="0s"
            />
            <SectionOverview
              header="Late Response"
              reports={reports.LR}
              handleDelete={handleDelete}
              chipColor={theme.palette.warning.main}
              animationDelay="0.1s"
            />
            <SectionOverview
              header="Other Reports"
              reports={reports.NoReportType}
              handleDelete={handleDelete}
              chipColor={theme.palette.info.main}
              animationDelay="0.2s"
            />
          </Box>
        </Fade>
      )}
    </Container>
  );
};

interface SectionOverviewType {
  header: "Late Activation" | "Late Response" | "Other Reports";
  reports: DisplayReportDataType[];
  handleDelete: (report: DisplayReportDataType) => () => void;
  chipColor: string;
  animationDelay: string;
}

const SectionOverview: FC<SectionOverviewType> = function ({
  header,
  reports,
  handleDelete,
  chipColor,
  animationDelay,
}) {
  const theme = useTheme();
  if (reports.length === 0) return null;

  const reportOverviews = reports.map((report, index) => (
    <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4 }}>
      <ReportOverview
        report={report}
        handleDelete={handleDelete}
        chipColor={chipColor}
        animationDelay={`${(parseFloat(animationDelay) + 0.05 * (index % 3)).toFixed(2)}s`}
      />
    </Grid>
  ));

  return (
    <Paper
      elevation={0}
      sx={{
        ...paperSx(chipColor, theme),
        ...fadeInAnimationSx(animationDelay),
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          color: theme.palette.text.primary,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            backgroundColor: chipColor,
            borderRadius: 1,
          },
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 26,
            backgroundColor: chipColor,
            mr: 2,
            borderRadius: 1,
          }}
        />
        {header}
        <Chip
          label={reports.length}
          size="small"
          sx={{
            ml: 2,
            bgcolor: alpha(chipColor, 0.1),
            color: chipColor,
            fontWeight: 500,
            border: `1px solid ${alpha(chipColor, 0.3)}`,
          }}
        />
      </Typography>
      <Grid container spacing={2.5}>
        {reportOverviews}
      </Grid>
    </Paper>
  );
};

interface ReportOverviewType {
  report: DisplayReportDataType;
  handleDelete: (report: DisplayReportDataType) => () => void;
  chipColor: string;
  animationDelay: string;
}

const ReportOverview: FC<ReportOverviewType> = function ({
  report,
  handleDelete,
  chipColor,
  animationDelay,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const opsCenterAcknowledged = report.opsCenterAcknowledged;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleDeleteConfirmed = () => {
    handleDelete(report)();
    setConfirmDelete(false);
    handleClose();
  };

  return (
    <>
      <Card
        elevation={2}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${report.incidentNumb || "report"}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 12px 28px ${alpha(theme.palette.common.black, 0.12)}`,
          },
          borderRadius: 2,
          overflow: "hidden",
          borderTop: `3px solid ${chipColor}`,
          position: "relative",
          cursor: "pointer",
          ...fadeInAnimationSx(animationDelay),
        }}
      >
        <Box
          sx={{
            display: "block",
            textAlign: "left",
            width: "100%",
            height: "100%",
          }}
        >
          <CardContent sx={{ flexGrow: 1, pb: 2 }}>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              fontWeight={500}
              noWrap
              sx={{ mb: 2 }}
            >
              {report.incidentNumb || "No Incident Number"}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <InfoItem label="Appliance" value={report.appliance} />
              <InfoItem label="SC" value={report.sc} />
              <InfoItem label="Location" value={report.location} />
            </Box>
          </CardContent>
        </Box>
      </Card>

      {/* Report Details Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        slotProps={{
          transition: {
            timeout: { enter: 300, exit: 250 },
            appear: false,
          },
          backdrop: {
            sx: {
              backgroundColor: alpha(theme.palette.background.default, 0.75),
              backdropFilter: "blur(12px)",
              transition: "all 0.3s ease-out",
            },
            timeout: {
              enter: 300,
              exit: 250,
            },
          },
          paper: {
            sx: {
              transform: "none",
              transition:
                "all 0.3s cubic-bezier(0.2, 0.0, 0.0, 1.0) !important",
              "&.MuiDialog-paper": {
                transform: open
                  ? "translateY(0) scale(1)"
                  : "translateY(20px) scale(0.98)",
                opacity: open ? 1 : 0,
              },
            },
          },
        }}
        sx={{
          perspective: "1200px",
          "& .MuiDialog-paper": {
            borderRadius: fullScreen ? 0 : 3,
            borderTop: `4px solid ${chipColor}`,
            overflow: "hidden",
            boxShadow: `0 24px 64px ${alpha(theme.palette.common.black, 0.25)}`,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(145deg, ${alpha(
                    theme.palette.background.paper,
                    0.9
                  )}, ${alpha(theme.palette.background.paper, 0.95)})`
                : `linear-gradient(145deg, ${theme.palette.background.paper}, ${alpha(
                    theme.palette.background.default,
                    0.98
                  )})`,
          },
        }}
        slots={{
          transition: Fade,
          backdrop: Backdrop,
        }}
        keepMounted
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1.5,
            pt: 2.5,
            px: 3,
            background: fullScreen
              ? `linear-gradient(to right, ${alpha(chipColor, 0.08)}, transparent)`
              : `linear-gradient(to right, ${alpha(chipColor, 0.08)}, transparent 70%)`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                left: -16,
                height: 36,
                width: 4,
                borderRadius: 2,
                backgroundColor: chipColor,
                boxShadow: `0 0 8px ${alpha(chipColor, 0.5)}`,
              },
            }}
          >
            <AssignmentOutlined
              sx={{
                mr: 1.5,
                color: chipColor,
                fontSize: "1.75rem",
                animation: open ? "fadeIn 0.5s ease-out" : "none",
                filter: `drop-shadow(0 2px 3px ${alpha(chipColor, 0.3)})`,
                ...ANIMATION_STYLES.fadeIn,
              }}
            />
            <Typography
              variant="h5"
              component="div"
              fontWeight={600}
              sx={{
                animation: open ? "slideIn 0.4s ease-out" : "none",
                background:
                  theme.palette.mode === "dark"
                    ? `linear-gradient(90deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.9)})`
                    : "none",
                WebkitBackgroundClip:
                  theme.palette.mode === "dark" ? "text" : "none",
                WebkitTextFillColor:
                  theme.palette.mode === "dark" ? "transparent" : "inherit",
                ...ANIMATION_STYLES.slideIn,
              }}
            >
              {report.incidentNumb || "No Incident Number"}
            </Typography>
          </Box>
          <MuiIconButton
            size="small"
            onClick={handleClose}
            aria-label="close dialog"
            sx={{
              borderRadius: 2,
              color: theme.palette.text.secondary,
              transition: "all 0.2s ease",
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                transform: "rotate(90deg)",
                boxShadow: `0 2px 6px ${alpha(theme.palette.common.black, 0.15)}`,
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </MuiIconButton>
        </DialogTitle>

        <Divider sx={{ opacity: 0.6 }} />

        <DialogContent
          sx={{
            px: 3,
            py: 3,
            overflowY: "auto",
            backgroundImage: `radial-gradient(
              ${alpha(chipColor, 0.03)} 1px, 
              transparent 1px
            )`,
            backgroundSize: "24px 24px",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
              },
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: alpha(theme.palette.divider, 0.05),
              borderRadius: "4px",
            },
          }}
        >
          <Stack spacing={3} sx={{ position: "relative" }}>
            {/* Incident Information */}
            <SectionDivider title="Incident Information" />
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem
                  label="Incident Number"
                  value={report.incidentNumb}
                  sx={getFadeSlideInAnimation("0.1s")}
                />
              </Grid>
              <Grid size={12}>
                <DetailItem
                  label="Location"
                  value={report.location}
                  sx={getFadeSlideInAnimation("0.2s")}
                />
              </Grid>
            </Grid>

            {/* Resource Information */}
            <SectionDivider title="Resource Information" />
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem
                  label="Appliance"
                  value={report.appliance}
                  sx={getFadeSlideInAnimation("0.25s")}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem
                  label="SC"
                  value={report.sc}
                  sx={getFadeSlideInAnimation("0.3s")}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem
                  label="Turnout From"
                  value={report.turnoutFrom}
                  sx={getFadeSlideInAnimation("0.35s")}
                />
              </Grid>
              {report.boundary && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    label="Boundary"
                    value={report.boundary + " minutes"}
                    sx={getFadeSlideInAnimation("0.4s")}
                  />
                </Grid>
              )}
            </Grid>

            {/* Combined Timing and Report Details */}
            <SectionDivider title="Report Details" />
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DetailItem
                  label={`Aces ${report.reportType === "LA" ? "Activation" : "Response"} Time`}
                  value={
                    report.acesTime.isZero()
                      ? ""
                      : report.acesTime.toString(true)
                  }
                  sx={getFadeSlideInAnimation("0.45s")}
                />
              </Grid>
              {!opsCenterAcknowledged && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <DetailItem
                    label={`Camera ${report.reportType === "LA" ? "Activation" : "Response"} Time`}
                    value={
                      report.cameraTime.isZero()
                        ? ""
                        : report.cameraTime.toString(true)
                    }
                    sx={getFadeSlideInAnimation("0.45s")}
                  />
                </Grid>
              )}
              <Grid size={12}>
                <DetailItem
                  label="Justification"
                  value={report.justification}
                  sx={getFadeSlideInAnimation("0.5s")}
                  multiline
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>

        <Divider sx={{ opacity: 0.6 }} />

        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            justifyContent: "space-between",
            background: alpha(theme.palette.background.default, 0.5),
            backdropFilter: "blur(5px)",
            borderTop: `1px solid ${alpha(chipColor, 0.1)}`,
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={handleConfirmDelete}
            startIcon={<Delete />}
            sx={{
              borderRadius: 2,
              borderColor: alpha(theme.palette.error.main, 0.5),
              px: 2,
              py: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
                borderColor: theme.palette.error.main,
                transform: "translateY(-2px)",
                boxShadow: `0 4px 8px ${alpha(theme.palette.error.main, 0.15)}`,
              },
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              ls.setWorkingOn(report.id);
              navigate("/add_entry");
            }}
            startIcon={<Edit />}
            sx={{
              borderRadius: 2,
              px: 2.5,
              py: 1,
              boxShadow: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        slots={{
          transition: Fade,
          backdrop: Backdrop,
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: alpha(theme.palette.background.default, 0.9),
              backdropFilter: "blur(15px)",
            },
            timeout: 300,
          },
          transition: {
            timeout: { enter: 300, exit: 200 },
          },
          paper: {
            sx: {
              transition:
                "all 0.3s cubic-bezier(0.2, 0.0, 0.0, 1.0) !important",
              "&.MuiDialog-paper": {
                transform: confirmDelete
                  ? "translateY(0) scale(1)"
                  : "translateY(20px) scale(0.98)",
                opacity: confirmDelete ? 1 : 0,
              },
            },
          },
        }}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: `0 24px 70px ${alpha(theme.palette.common.black, 0.4)}`,
            background: theme.palette.background.paper,
            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            borderTop: `3px solid ${theme.palette.error.main}`,
          },
        }}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle
          sx={{
            pb: 2,
            pt: 2.5,
            px: 3,
            display: "flex",
            alignItems: "center",
            position: "relative",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
          id="delete-dialog-title"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 42,
                height: 42,
                borderRadius: "50%",
                backgroundColor: alpha(theme.palette.error.main, 0.12),
                color: theme.palette.error.main,
                boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.15)}`,
              }}
            >
              <Delete />
            </Box>
            <Typography variant="h6" component="div" fontWeight={600}>
              Confirm Deletion
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }} id="delete-dialog-description">
          <Typography
            variant="body1"
            sx={{
              my: 3,
              color: alpha(theme.palette.text.primary, 0.9),
              lineHeight: 1.6,
            }}
          >
            You are about to permanently delete this report. This action cannot
            be undone.
          </Typography>

          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.default, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <Box
              component="span"
              sx={{
                color: theme.palette.warning.main,
                mt: 0.5,
                display: "flex",
              }}
            >
              <AssignmentOutlined fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: theme.palette.text.primary,
                }}
              >
                Report details:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                {report.incidentNumb ? (
                  <>
                    Incident Number: <strong>{report.incidentNumb}</strong>
                  </>
                ) : (
                  "Report without incident number"
                )}
                {report.location && (
                  <Box component="span" sx={{ display: "block", mt: 0.5 }}>
                    Location: {report.location}
                  </Box>
                )}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            bgcolor: alpha(theme.palette.background.default, 0.3),
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            sx={{
              borderRadius: 1.5,
              px: 3,
              py: 1,
              fontWeight: 500,
              borderColor: alpha(theme.palette.divider, 0.5),
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                borderColor: theme.palette.divider,
              },
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirmed}
            startIcon={<Delete fontSize="small" />}
            sx={{
              borderRadius: 1.5,
              px: 3,
              py: 1,
              fontWeight: 500,
              boxShadow: `0 2px 8px ${alpha(theme.palette.error.main, 0.2)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: `0 6px 16px ${alpha(theme.palette.error.main, 0.25)}`,
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            Delete Report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Section divider component
const SectionDivider: FC<{ title: string }> = ({ title }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Typography
        variant="subtitle1"
        component="h3"
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            display: "inline-block",
            width: 4,
            height: 18,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1,
            mr: 1.5,
          },
        }}
      >
        {title}
      </Typography>
      <Divider sx={{ mt: 1, opacity: 0.6 }} />
    </Box>
  );
};

// Update DetailItem to support multiline text and highlighting
const DetailItem: FC<
  InfoItemProps & { sx?: SxProps; multiline?: boolean; highlight?: boolean }
> = ({ label, value, sx = {}, multiline = false, highlight = false }) => {
  const theme = useTheme();

  return (
    <Box sx={sx}>
      <Typography
        variant="subtitle2"
        component="div"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          mb: 0.75,
          display: "flex",
          alignItems: "center",
          "&::before": {
            content: '""',
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: highlight ? "error.main" : "primary.main",
            mr: 1.5,
            opacity: 0.7,
          },
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        component="div"
        sx={{
          py: 1.75,
          px: 2.5,
          borderRadius: 2,
          bgcolor: (theme) =>
            highlight
              ? alpha(theme.palette.error.main, 0.05)
              : alpha(theme.palette.background.default, 0.6),
          border: (theme) =>
            highlight
              ? `1px solid ${alpha(theme.palette.error.main, 0.1)}`
              : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          wordBreak: "break-word",
          whiteSpace: multiline ? "pre-wrap" : "normal",
          maxHeight: multiline ? "200px" : "auto",
          overflowY: multiline ? "auto" : "visible",
          boxShadow: `inset 0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
          backdropFilter: "blur(4px)",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: (theme) =>
              highlight
                ? alpha(theme.palette.error.main, 0.08)
                : alpha(theme.palette.background.default, 0.8),
            transform: "translateY(-1px)",
            boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
          },
        }}
      >
        {value || "Not specified"}
      </Typography>
    </Box>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: FC<InfoItemProps> = ({ label, value }) => {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="caption"
        component="div"
        color="text.secondary"
        sx={{ fontWeight: 500 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value || "Not specified"}
      </Typography>
    </Box>
  );
};

export default History;
