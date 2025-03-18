import { FC, useEffect, useState } from "react";

import ActionButton from "../../components/ActionButton";
import "./History.css";
import { useNavBarTextContext } from "../../context/contextFunctions";
import updateBackground from "../../features/updateBackground";
import { retrieveAll } from "../../features/db";
import Report from "../../classes/Report";

const History: FC = function () {
  updateBackground();
  const [reports, setReports] = useState<Report[]>([]);

  const updateNavBarText = useNavBarTextContext() as React.Dispatch<
    React.SetStateAction<string>
  >;
  updateNavBarText("History");

  useEffect(() => {
    const fetchReports = async () => {
      const data = await retrieveAll();
      setReports(data);
      console.log(data);
    };

    fetchReports().catch((e: unknown) => {
      console.error(e);
    });
  }, []);

  return <ActionButton />;
};

interface SectionOverviewType {
  report: Report;
}

const SectionOverview: FC<SectionOverviewType> = function ({ report }) {
  return <></>;
};

export default History;
