import { Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { FC } from "react";
import { Link } from "react-router-dom";

const ActionButton: FC = () => {
  return (
    <Link to="/add_entry">
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
      >
        <Add />
      </Fab>
    </Link>
  );
};

export default ActionButton;
