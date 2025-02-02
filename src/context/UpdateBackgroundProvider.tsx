/**
 * Context for using and updating the background
 */

import { FC, useState } from "react";
import { Box } from "@mui/material";
import { updateBackgroundContext } from "../utils/contextFunctions";
import { type ChildrenOnly } from "../types/types";

const basicSx = {
  minHeight: "100vh",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
} as const;

const UpdateBackgroundProvider: FC<ChildrenOnly> = function ({ children }) {
  const [background, setBackground] = useState<{ backgroundImage?: string }>({});

  const updateBackground = function (background?: string) {
    setBackground(
      background
        ? {
            backgroundImage: `url(${background})`,
          }
        : {}
    );
  };

  return (
    <Box sx={{ ...basicSx, ...background }}>
      <updateBackgroundContext.Provider value={updateBackground}>
        {children}
      </updateBackgroundContext.Provider>
    </Box>
  );
};

export default UpdateBackgroundProvider;
