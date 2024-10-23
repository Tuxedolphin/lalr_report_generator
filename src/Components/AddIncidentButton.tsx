import { useState, FC } from "react";
import {
  TextField,
  Typography,
  Divider,
  MobileStepper,
  FormLabel,
  Theme,
  Box,
  Paper,
  Button,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const AddIncidentButton: FC = () => {
  return (
    <Link to="/add_entry">
      <Box>
        <Button
          variant="outlined"
          fullWidth
          endIcon={<Add />}
          sx={{ justifyContent: "space-between", height: 60 }}
        >
          Add Incident
        </Button>
      </Box>
    </Link>
  );
};

export default AddIncidentButton;
