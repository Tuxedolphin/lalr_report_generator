import { FC, useEffect, useState } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import "./History.css";
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
  const [reports, setReports] = useState<SortedDisplayReportDataType>({
    LA: [],
    LR: [],
    NoReportType: [],
  });

  const updateNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;

  useEffect(() => {
    const fetchReports = async () => {
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
    };

    updateNavBarText("History");

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

  return (
    <>
      {reports.LA.length === 0 &&
      reports.LR.length === 0 &&
      reports.NoReportType.length === 0 ? (
        <Paper sx={{ m: 1, p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
            No Records Available
            </Typography>
          <Button
            color="primary"
            onClick={() => {
              navigate("/add_entry");
            }}
            sx={{ mt: 1 }}
            aria-label="add report"
            startIcon={<Edit />}
            size="large"

          >
            Add Report
          </Button>
        </Paper>
      ) : (
        <>
          <SectionOverview
            header="Late Activation"
            reports={reports.LA}
            handleDelete={handleDelete}
          />
          <SectionOverview
            header="Late Response"
            reports={reports.LR}
            handleDelete={handleDelete}
          />
          <SectionOverview
            header="No Report Type"
            reports={reports.NoReportType}
            handleDelete={handleDelete}
          />
        </>
      )}
    </>
  );
};

interface SectionOverviewType {
  header: "Late Activation" | "Late Response" | "No Report Type";
  reports: DisplayReportDataType[];
  handleDelete: (report: DisplayReportDataType) => () => void;
}

const SectionOverview: FC<SectionOverviewType> = function ({
  header,
  reports,
  handleDelete,
}) {
  if (reports.length === 0) return;

  return (
    <Paper sx={{ m: 1 }}>
      <List sx={{ width: "100%" }}>
        <Divider sx={{ paddingBottom: 1 }}>{header}</Divider>
        {reports.map((report) => (
          <ReportOverview
            report={report}
            key={report.id}
            handleDelete={handleDelete}
          />
        ))}
      </List>
    </Paper>
  );
};

interface ReportOverviewType {
  report: DisplayReportDataType;
  handleDelete: (report: DisplayReportDataType) => () => void;
}

const ReportOverview: FC<ReportOverviewType> = function ({
  report,
  handleDelete,
}) {
  const navigate = useNavigate();

  return (
    <>
      <ListItem
        alignItems="flex-start"
        secondaryAction={
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => {
                  ls.workingOn = report.id;
                  navigate("/add_entry");
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={handleDelete(report)}
              >
                <Delete color="error" />
              </IconButton>
            </Box>
          </>
        }
      >
        <ListItemText
          inset
          primary={
            report.incidentNumb
              ? report.incidentNumb
              : "No Incident Number Found"
          } // Done as report.incidentNumb could be empty string
          secondary={
            <>
              <SecondaryText
                primary="Appliance:"
                secondary={report.appliance}
              />
              <br />
              <SecondaryText primary="SC:" secondary={report.sc} />
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" sx={{ my: 1 }} />
    </>
  );
};

interface SecondaryTextType {
  primary: string;
  secondary: string;
}

const SecondaryText: FC<SecondaryTextType> = function ({ primary, secondary }) {
  secondary = secondary ? secondary : "No Data Found"; // Done as secondary could be empty string

  return (
    <Typography
      component="span"
      variant="body2"
      sx={{ color: "text.primary", display: "inline", p: 1 }}
    >
      {primary}
      {" " + secondary}
    </Typography>
  );
};

export default History;
