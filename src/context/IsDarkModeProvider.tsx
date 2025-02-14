/**
 * Context for the mode of the entire app, i.e. dark mode or light mode
 */

import { FC, useState } from "react";
import { IsDarkModeContext } from "../utils/contextFunctions";
import { type ChildrenOnly } from "../types/types";

const IsDarkModeProvider: FC<ChildrenOnly> = function ({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default mode is dark mode

  const updateIsDarkMode = function () {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <IsDarkModeContext.Provider value={[isDarkMode, updateIsDarkMode]}>
      {children}
    </IsDarkModeContext.Provider>
  );
};

export default IsDarkModeProvider