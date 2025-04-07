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
  CalendarMonth as DateIcon,
  AssignmentOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNavBarTextContext } from "../../context/contextFunctions";
import updateBackground from "../../features/updateBackground";
import { retrieveAll, deleteReport } from "../../features/db";
import ls from "../../features/LocalStorage";
import { DisplayReportDataType } from "../../types/types";

interface SortedDisplayReportDataType {
  LA: DisplayReportDataType[];
  LR: DisplayReportDataType[];
  NoReportType: DisplayReportDataType[];
}

const History: FC = function () {
  updateBackground();
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
              p: 5,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: 70,
                color: "text.secondary",
                mb: 2,
                opacity: 0.7,
              }}
            />
            <Typography
              variant="h5"
              gutterBottom
              color="text.primary"
              fontWeight="medium"
            >
              No Reports Available
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              component="p"
              sx={{ mb: 3, maxWidth: 450, mx: "auto" }}
            >
              You haven&apos;t created any reports yet. Create your first report
              to get started.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/add_entry");
              }}
              sx={{
                mt: 1,
                py: 1.2,
                px: 4,
                borderRadius: 2,
                fontWeight: "medium",
                boxShadow: 3,
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
            />
            <SectionOverview
              header="Late Response"
              reports={reports.LR}
              handleDelete={handleDelete}
              chipColor={theme.palette.warning.main}
            />
            <SectionOverview
              header="Other Reports"
              reports={reports.NoReportType}
              handleDelete={handleDelete}
              chipColor={theme.palette.info.main}
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
}

const SectionOverview: FC<SectionOverviewType> = function ({
  header,
  reports,
  handleDelete,
  chipColor,
}) {
  const theme = useTheme();
  if (reports.length === 0) return null;

  const reportOverviews = reports.map((report) => (
    <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4 }}>
      <ReportOverview
        report={report}
        handleDelete={handleDelete}
        chipColor={chipColor}
      />
    </Grid>
  ));

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        background: alpha(theme.palette.background.paper, 0.7),
        border: `1px solid ${alpha(chipColor, 0.1)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 4px 20px ${alpha(chipColor, 0.15)}`,
          background: alpha(theme.palette.background.paper, 0.9),
        },
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
}

const ReportOverview: FC<ReportOverviewType> = function ({
  report,
  handleDelete,
  chipColor,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                <DateIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                <Typography variant="caption" component="span">
                  {new Date(Date.now()).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>

      {/* Modal dialog for centered expanded view */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        slotProps={{
          transition: {
            timeout: { enter: 250, exit: 200 },
            appear: false,
          },
          backdrop: {
            sx: {
              backgroundColor: alpha(theme.palette.background.default, 0.7),
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease-out",
            },
            timeout: {
              enter: 250,
              exit: 200,
            },
          },
          paper: {
            sx: {
              transform: "none",
              transition:
                "all 0.25s cubic-bezier(0.2, 0.0, 0.0, 1.0) !important",
              "&.MuiDialog-paper": {
                transform: open ? "translateY(0)" : "translateY(20px)",
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
            boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.2)}`,
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
        disablePortal
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1.5,
            pt: 2.5,
            px: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AssignmentOutlined
              sx={{
                mr: 1.5,
                color: chipColor,
                fontSize: "1.75rem",
                animation: open ? "fadeIn 0.5s ease-out" : "none",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0, transform: "translateY(-5px)" },
                  "100%": { opacity: 1, transform: "translateY(0)" },
                },
              }}
            />
            <Typography
              variant="h5"
              component="div"
              fontWeight={600}
              sx={{
                animation: open ? "slideIn 0.4s ease-out" : "none",
                "@keyframes slideIn": {
                  "0%": { opacity: 0, transform: "translateX(-5px)" },
                  "100%": { opacity: 1, transform: "translateX(0)" },
                },
              }}
            >
              {report.incidentNumb || "No Incident Number"}
            </Typography>
          </Box>
          <MuiIconButton
            size="small"
            onClick={handleClose}
            sx={{
              borderRadius: 2,
              color: theme.palette.text.secondary,
              transition: "all 0.2s ease",
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                transform: "rotate(90deg)",
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
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: alpha(theme.palette.divider, 0.05),
            },
          }}
        >
          <Stack spacing={3} sx={{ position: "relative" }}>
            {[
              { label: "Appliance", value: report.appliance },
              { label: "SC", value: report.sc },
              {
                label: "Incident Type",
                value: report.reportType ?? "Not specified",
              },
              {
                label: "Created",
                value: new Date(Date.now()).toLocaleDateString(),
              },
            ].map((item, index) => (
              <DetailItem
                key={item.label}
                label={item.label}
                value={item.value}
                sx={{
                  animation: open
                    ? `fadeSlideIn 0.5s ${(index * 0.1).toString()}s both`
                    : "none",
                  "@keyframes fadeSlideIn": {
                    "0%": { opacity: 0, transform: "translateY(10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              />
            ))}
          </Stack>
        </DialogContent>

        <Divider sx={{ opacity: 0.6 }} />

        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            justifyContent: "space-between",
            background: alpha(theme.palette.background.default, 0.4),
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

      <Dialog
        open={confirmDelete}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        slots={{
          transition: Fade,
        }}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            borderTop: `4px solid ${theme.palette.error.main}`,
            overflow: "hidden",
          },
        }}
        slotProps={{
          paper: {
            sx: {
              transition:
                "all 0.25s cubic-bezier(0.2, 0.0, 0.0, 1.0) !important",
              "&.MuiDialog-paper": {
                transform: confirmDelete ? "translateY(0)" : "translateY(20px)",
                opacity: confirmDelete ? 1 : 0,
              },
            },
          },
        }}
        disablePortal
      >
        <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
          <Typography
            variant="h6"
            component="div"
            fontWeight={600}
            color="error.main"
          >
            Confirm Delete
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete this report? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            py: 2.5,
            bgcolor: alpha(theme.palette.background.default, 0.4),
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancelDelete}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.75,
              "&:hover": {
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirmed}
            sx={{
              borderRadius: 2,
              px: 2,
              py: 0.75,
              ml: 1.5,
              boxShadow: 2,
              "&:hover": {
                boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.25)}`,
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
}

// DetailItem component for the modal view
const DetailItem: FC<InfoItemProps & { sx?: SxProps }> = ({
  label,
  value,
  sx = {},
}) => {
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
            backgroundColor: "primary.main",
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
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.6),
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          wordBreak: "break-word",
          boxShadow: `inset 0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
          backdropFilter: "blur(4px)",
          transition: "background-color 0.2s ease",
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
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
