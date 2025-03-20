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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import "./History.css";
import {
  useNavBarTextContext,
} from "../../context/contextFunctions";
import updateBackground from "../../features/updateBackground";
import { retrieveAll } from "../../features/db";
import Report from "../../classes/Report";
import ls from "../../features/LocalStorage";

const History: FC = function () {
  updateBackground();
  const [reports, setReports] = useState<Report[]>([]);

  const updateNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;

  useEffect(() => {
    updateNavBarText("History");
  }, [updateNavBarText]);

  useEffect(() => {
    const fetchReports = async () => {
      const data = await retrieveAll();
      setReports(data);
    };

    fetchReports().catch((e: unknown) => {
      console.error(e);
      
    });
  }, []);

  const handleDelete = (report: Report) => () => {
    const newData = [...reports];

    const index = newData.indexOf(report);
    if (index < 0) return;

    newData.splice(index, 1);
    setReports(newData);

    report.deleteDBReport();
  };

  const reportItems = reports.map((report) => (
    <SectionOverview
      report={report}
      handleDelete={handleDelete}
      key={report.id}
    />
  ));

  return (
    <Paper sx={{ m: 1 }}>
      <List sx={{ width: "100%" }}>{reportItems}</List>
    </Paper>
  );
};

interface SectionOverviewType {
  report: Report;
  handleDelete: (report: Report) => () => void;
}

const SectionOverview: FC<SectionOverviewType> = function ({
  report,
  handleDelete,
}) {
  const navigate = useNavigate();

  const incidentInformation = report.incidentInformation;

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
            incidentInformation.incidentNumb
              ? incidentInformation.incidentNumb
              : "No Incident Number Found"
          }
          secondary={
            <>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.primary", display: "inline", p: 1 }}
              >
                Appliance:
              </Typography>
              {" " + incidentInformation.appliance}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" sx={{ my: 1 }} />
    </>
  );
};

export default History;
