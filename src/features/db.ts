import Report from "../classes/Report";
import DBPhoto from "../classes/DBPhoto";
import Dexie, { type EntityTable } from "dexie";
import {
  AcesInformationType,
  CameraInformationType,
  GeneralInformationType,
  IncidentInformationType,
  ReportKeys,
  ReportValueKeysType,
  ReportValueTypes,
} from "../types/types";
import CroppedPicture from "../classes/CroppedPicture";
import DrawnOnPicture from "../classes/DrawnOnPicture";
import { Crop } from "react-image-crop";
import { Dayjs } from "dayjs";

// =========================================
//         Defining useful types
// =========================================

type DBAcesInformationType = Omit<
  AcesInformationType,
  "acesScreenshot" | "drawnScreenshot"
> & {
  acesScreenshot: DBPhoto | undefined;
  drawnScreenshot: DBPhoto | undefined;
};

type DBCameraInformationType = Omit<
  CameraInformationType,
  "dispatchPhoto" | "allInPhoto" | "moveOffPhoto" | "arrivedPhoto"
> & {
  dispatchPhoto: DBPhoto | undefined;
  allInPhoto: DBPhoto | undefined;
  moveOffPhoto: DBPhoto | undefined;
  arrivedPhoto: DBPhoto | undefined;
};

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

function updateErrorType(image?: CroppedPicture | DrawnOnPicture) {
  return image ? new DBPhoto(image) : undefined;
}

function formatAcesInformationForDB(
  info: AcesInformationType
): DBAcesInformationType {
  return {
    ...info,
    acesScreenshot: updateErrorType(info.acesScreenshot),
    drawnScreenshot: updateErrorType(info.drawnScreenshot),
  };
}

function formatCameraInformationForDB(
  info: CameraInformationType
): DBCameraInformationType {
  return {
    ...info,
    dispatchPhoto: updateErrorType(info.dispatchPhoto),
    allInPhoto: updateErrorType(info.allInPhoto),
    moveOffPhoto: updateErrorType(info.moveOffPhoto),
    arrivedPhoto: updateErrorType(info.arrivedPhoto),
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

function formatAcesInformationForUse(
  info: DBAcesInformationType
): AcesInformationType {
  return {
    ...info,
    acesScreenshot: info.acesScreenshot
      ? reconstructDBPhoto(info.acesScreenshot)?.getCroppedPicture()
      : undefined,
    drawnScreenshot: info.drawnScreenshot
      ? reconstructDBPhoto(info.drawnScreenshot)?.getDrawnOnPicture()
      : undefined,
  };
}

function formatCameraInformationForUse(
  info: DBCameraInformationType
): CameraInformationType {
  return {
    ...info,
    dispatchPhoto: info.dispatchPhoto
      ? reconstructDBPhoto(info.dispatchPhoto)?.getCroppedPicture()
      : undefined,
    allInPhoto: info.allInPhoto
      ? reconstructDBPhoto(info.allInPhoto)?.getCroppedPicture()
      : undefined,
    moveOffPhoto: info.moveOffPhoto
      ? reconstructDBPhoto(info.moveOffPhoto)?.getCroppedPicture()
      : undefined,
    arrivedPhoto: info.arrivedPhoto
      ? reconstructDBPhoto(info.arrivedPhoto)?.getCroppedPicture()
      : undefined,
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

export async function retrieveAll() {
  const result = await db.reports.toArray();
  return result.map(formatDBReport);
}
