/**
 * Context for passing the height of the nav bar, so as to set the height of certain elements correctly
 */

import { FC, useState } from "react";
import { NavBarHeightContext } from "../utils/contextFunctions";
import { type ChildrenOnly } from "../types/types";

const NavBarHeightProvider: FC<ChildrenOnly> = function ({ children }) {
  const stateSetterValue = useState(0);

  return (
    <NavBarHeightContext.Provider value={stateSetterValue}>
      {children}
    </NavBarHeightContext.Provider>
  );
};

export default NavBarHeightProvider;
