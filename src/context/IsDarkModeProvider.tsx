/**
 * Context for the mode of the entire app, i.e. dark mode or light mode
 */

import { FC, useState } from "react";
import { IsDarkModeContext } from "./contextFunctions";
import { type ChildrenOnly } from "../types/types";
import ls from "../features/LocalStorage";

const IsDarkModeProvider: FC<ChildrenOnly> = function ({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(ls.getDarkMode());

  const updateIsDarkMode = function () {
    ls.setDarkMode(!isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <IsDarkModeContext.Provider value={[isDarkMode, updateIsDarkMode]}>
      {children}
    </IsDarkModeContext.Provider>
  );
};

export default IsDarkModeProvider;
