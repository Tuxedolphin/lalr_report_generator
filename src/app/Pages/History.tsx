import { FC } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ActionButton from "../../../Components/ActionButton.tsx";
import "./History.css";

interface HistoryProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const History: FC<HistoryProps> = (props) => {
  props.setText("LALR Generator");

  return <ActionButton />;
};

export default History;
