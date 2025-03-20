/**
 * Context to hold information of current report and function to update it
 */

import { FC, useState } from "react";
import Report from "../classes/Report";
import { ReportContext } from "./contextFunctions";
import { type ChildrenOnly } from "../types/types";
import { type UpdateReportType } from "../types/types";

import { checkAndUpdateID } from "../utils/generalFunctions";
import {
  type CameraInformationType,
  type AcesInformationType,
  type GeneralInformationType,
  type IncidentInformationType,
} from "../types/types";

const ReportProvider: FC<ChildrenOnly> = function ({ children }) {
  const [report, setReport] = useState<Report>(new Report());

  // Object to update report. Repeated code because I'm too lazy to refactor it (and hey it is safer!)
  const updateReport: UpdateReportType = {
    id: (...args) => {
      report.updateID(...args);
      setReport(report.copy());
    },
    cameraInformation: (
      key: keyof CameraInformationType,
      value: CameraInformationType[keyof CameraInformationType],
      saveToDB = false
    ) => {
      checkAndUpdateID(report)
        .then((report) => {
          report.updateCameraInformation(key, value);
          setReport(report.copy());

          if (saveToDB) report.updateDBReport("cameraInformation");
        })
        .catch((e: unknown) => {
          console.error(e);
        });
    },
    acesInformation: (
      key: keyof AcesInformationType,
      value: AcesInformationType[keyof AcesInformationType],
      saveToDB = false
    ) => {
      checkAndUpdateID(report)
        .then((report) => {
          report.updateAcesInformation(key, value);
          setReport(report.copy());

          if (saveToDB) report.updateDBReport("acesInformation");
        })
        .catch((e: unknown) => {
          console.error(e);
        });
    },
    generalInformation: (
      key: keyof GeneralInformationType,
      value: GeneralInformationType[keyof GeneralInformationType],
      saveToDB = false
    ) => {
      checkAndUpdateID(report)
        .then((report) => {
          report.updateGeneralInformation(key, value);
          setReport(report.copy());

          if (saveToDB) report.updateDBReport("generalInformation");
        })
        .catch((e: unknown) => {
          console.error(e);
        });
      setReport(report.copy());
    },
    incidentInformation: (
      key: keyof IncidentInformationType,
      value: IncidentInformationType[keyof IncidentInformationType],
      saveToDB = false
    ) => {
      checkAndUpdateID(report)
        .then((report) => {
          report.updateIncidentInformation(key, value);
          setReport(report.copy());

          if (saveToDB) report.updateDBReport("incidentInformation");
        })
        .catch((e: unknown) => {
          console.error(e);
        });
    },
    all: (report: Report) => {
      setReport(report);
    },
  } as const;

  return (
    <ReportContext.Provider value={[report, updateReport, setReport]}>
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
