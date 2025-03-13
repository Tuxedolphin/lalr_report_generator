import { FC } from "react";

import ActionButton from "../../components/ActionButton";
import "./History.css";
import { useNavBarTextContext } from "../../context/contextFunctions";
import updateBackground from "../../features/updateBackground";

const History: FC = function () {
  updateBackground();

  const updateNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;
  updateNavBarText("History");

  return <ActionButton />;
};

export default History;
