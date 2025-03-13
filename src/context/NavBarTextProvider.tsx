/**
 * Context to hold information for the text to be displayed in the nav bar and the function to update it
 */

import { FC, useState } from "react";
import { NavBarTextContext } from "./contextFunctions";
import { type ChildrenOnly } from "../types/types";

const NavBarTextProvider: FC<ChildrenOnly> = function ({ children }) {
  const [text, setText] = useState("");

  return (
    <NavBarTextContext.Provider value={[text, setText]}>
      {children}
    </NavBarTextContext.Provider>
  );
};

export default NavBarTextProvider;
