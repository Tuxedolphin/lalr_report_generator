import Dexie, { type EntityTable } from "dexie";

import Report from "../classes/Report";
import DBPhoto from "../classes/DBPhoto";
import {
  AcesInformationType,
  CameraInformationType,
  DisplayReportDataType,
  GeneralInformationType,
  IncidentInformationType,
  ReportKeys,
  ReportType,
} from "../types/types";
import CroppedPicture from "../classes/CroppedPicture";
import DrawnOnPicture from "../classes/DrawnOnPicture";
import dayjs, { Dayjs } from "dayjs";

// =========================================
//         Defining useful types
// =========================================

interface DBAcesInformationType {
  timeDispatched: string | null;
  timeResponded: string | null;
  timeEnRoute: string | null;
  timeArrived: string | null;
  acesScreenshot: DBPhoto | undefined;
  drawnScreenshot: DBPhoto | undefined;
}

interface DBCameraInformationType {
  timeDispatched: string | null;
  timeResponded: string | null;
  timeAllIn: string | null;
  timeMoveOff: string | null;
  timeArrived: string | null;
  hasBufferTime: boolean | null;
  bufferingTime: string | null;
  bufferingLocation: string;
  dispatchPhoto: DBPhoto | undefined;
  allInPhoto: DBPhoto | undefined;
  moveOffPhoto: DBPhoto | undefined;
  arrivedPhoto: DBPhoto | undefined;
}

export interface ReportDBType {
  id: number;
  incidentInformation: IncidentInformationType;
  generalInformation: GeneralInformationType;
  acesInformation: DBAcesInformationType;
  cameraInformation: DBCameraInformationType;
}

// =========================================
//         Initialising Database
// =========================================

export const db = new Dexie("ReportDatabase") as Dexie & {
  reports: EntityTable<ReportDBType, "id">;
};

db.version(1).stores({
  reports: "++id",
});

// =========================================
//           Utility Functions
// =========================================

function formatImage(image?: CroppedPicture | DrawnOnPicture) {
  return image ? new DBPhoto(image) : undefined;
}

function formatDayjs(dayjs: Dayjs | null) {
  return dayjs ? dayjs.toJSON() : null;
}

function formatAcesInformationForDB(
  info: AcesInformationType
): DBAcesInformationType {
  return {
    timeDispatched: formatDayjs(info.timeDispatched),
    timeArrived: formatDayjs(info.timeArrived),
    timeEnRoute: formatDayjs(info.timeEnRoute),
    timeResponded: formatDayjs(info.timeResponded),
    acesScreenshot: formatImage(info.acesScreenshot),
    drawnScreenshot: formatImage(info.drawnScreenshot),
  };
}

function formatCameraInformationForDB(
  info: CameraInformationType
): DBCameraInformationType {
  return {
    ...info,
    timeDispatched: formatDayjs(info.timeDispatched),
    timeArrived: formatDayjs(info.timeArrived),
    timeAllIn: formatDayjs(info.timeAllIn),
    timeMoveOff: formatDayjs(info.timeMoveOff),
    timeResponded: formatDayjs(info.timeResponded),
    bufferingTime: formatDayjs(info.bufferingTime),
    dispatchPhoto: formatImage(info.dispatchPhoto),
    allInPhoto: formatImage(info.allInPhoto),
    moveOffPhoto: formatImage(info.moveOffPhoto),
    arrivedPhoto: formatImage(info.arrivedPhoto),
  };
}

function formatReport(report: Report): ReportDBType {
  return {
    id: report.id,
    incidentInformation: report.incidentInformation,
    generalInformation: report.generalInformation,
    acesInformation: formatAcesInformationForDB(report.acesInformation),
    cameraInformation: formatCameraInformationForDB(report.cameraInformation),
  };
}

function reconstructDBPhoto(photo?: DBPhoto): DBPhoto | undefined {
  if (!photo) return;
  return new DBPhoto(
    photo.crop
      ? new CroppedPicture(photo.blob, photo.crop)
      : new DrawnOnPicture(
          photo.blob,
          photo.coordinates?.[0] ?? undefined,
          photo.coordinates?.[1] ?? undefined
        )
  );
}

function reconstructDayjs(time: string | null): Dayjs | null {
  return time ? dayjs(time) : null;
}

function formatAcesInformationForUse(
  info: DBAcesInformationType
): AcesInformationType {
  return {
    timeDispatched: reconstructDayjs(info.timeDispatched),
    timeArrived: reconstructDayjs(info.timeArrived),
    timeEnRoute: reconstructDayjs(info.timeEnRoute),
    timeResponded: reconstructDayjs(info.timeResponded),
    acesScreenshot: reconstructDBPhoto(
      info.acesScreenshot
    )?.getCroppedPicture(),
    drawnScreenshot: reconstructDBPhoto(
      info.drawnScreenshot
    )?.getDrawnOnPicture(),
  };
}

function formatCameraInformationForUse(
  info: DBCameraInformationType
): CameraInformationType {
  return {
    ...info,
    timeDispatched: reconstructDayjs(info.timeDispatched),
    timeArrived: reconstructDayjs(info.timeArrived),
    timeAllIn: reconstructDayjs(info.timeAllIn),
    timeMoveOff: reconstructDayjs(info.timeMoveOff),
    timeResponded: reconstructDayjs(info.timeResponded),
    bufferingTime: reconstructDayjs(info.bufferingTime),
    dispatchPhoto: reconstructDBPhoto(info.dispatchPhoto)?.getCroppedPicture(),
    allInPhoto: reconstructDBPhoto(info.allInPhoto)?.getCroppedPicture(),
    moveOffPhoto: reconstructDBPhoto(info.moveOffPhoto)?.getCroppedPicture(),
    arrivedPhoto: reconstructDBPhoto(info.arrivedPhoto)?.getCroppedPicture(),
  };
}

function formatDBReport(report: ReportDBType): Report {
  return new Report(
    report.id,
    report.incidentInformation,
    report.generalInformation,
    formatAcesInformationForUse(report.acesInformation),
    formatCameraInformationForUse(report.cameraInformation)
  );
}

// =========================================
//       Accessing/ Retrieving from DB
// =========================================

/**
 * Adds a report to IndexedDB
 * @param report The report to be added to the database
 * @returns A promise which successfully resolves to be the id of the object
 */
export async function addReport(report: Report) {
  const r = formatReport(report);

  return await db.reports.add({
    acesInformation: r.acesInformation,
    cameraInformation: r.cameraInformation,
    incidentInformation: r.incidentInformation,
    generalInformation: r.generalInformation,
  });
}

export function updateReport(
  id: number,
  key: ReportKeys,
  value:
    | AcesInformationType
    | CameraInformationType
    | IncidentInformationType
    | GeneralInformationType
    | DBAcesInformationType
    | DBCameraInformationType
) {
  if (key === "acesInformation")
    value = formatAcesInformationForDB(value as AcesInformationType);
  else if (key === "cameraInformation")
    value = formatCameraInformationForDB(value as CameraInformationType);

  db.reports
    .update(id, { [key as string]: value })
    .then((updated) => {
      if (!updated) {
        throw new Error(`No report updated with id ${id.toString()}`);
      } else return updated;
    })
    .catch((error: unknown) => {
      console.error(error);
      return -1;
    });
}

export function deleteReport(id: number) {
  db.reports.delete(id).catch((error: unknown) => {
    throw new Error(String(error)); // Rethrow the error just so that eslint is happy with the catch block
  });
}

export function deleteAll() {
  db.reports.clear().catch((error: unknown) => {
    throw new Error(String(error));
  });
}

export async function retrieveReport(id: number) {
  const result = await db.reports.get(id);

  if (!result)
    throw new Error(
      `Result with id ${id.toString()} does not exist in database.`
    );

  return formatDBReport(result);
}

export async function retrieveAll(): Promise<DisplayReportDataType[]> {
  const result = await db.reports.toArray();
  return result.map((report) => {
    return {
      id: report.id,
      incidentNumb: report.incidentInformation.incidentNumb,
      appliance: report.incidentInformation.appliance,
      sc: report.incidentInformation.SC,
      reportType: report.incidentInformation.reportType,
    };
  });
}
