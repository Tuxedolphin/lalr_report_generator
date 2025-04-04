// External imports
import { Dayjs } from "dayjs";
import { ReactNode } from "react";

// Internal imports
import CroppedPicture from "../classes/CroppedPicture";
import DrawnOnPicture from "../classes/DrawnOnPicture";
import type Report from "../classes/Report";

// ====== BASIC TYPES ======

// Report identification types
export type ReportType = "LA" | "LR" | null;

// Report structure types
export type ReportKeys =
  | "incidentInformation"
  | "generalInformation"
  | "acesInformation"
  | "cameraInformation";

// Photo related types
export type PhotosType =
  | "acesScreenshot"
  | "dispatchPhoto"
  | "allInPhoto"
  | "moveOffPhoto"
  | "arrivedPhoto";

// ====== UI COMPONENTS ======
export interface ChildrenOnly {
  children: ReactNode;
}

// ====== DATA MODELS ======

// Core information models
export interface IncidentInformationType {
  incidentNumb: string;
  location: string;
  station: string;
  appliance: string;
  SC: string;
  turnoutFrom: string;
  typeOfCall: string;
  reportType: ReportType;
  opsCenterAcknowledged: boolean | null;
}

export interface GeneralInformationType {
  boundary: string | null;
  justification: string | null;
  weather: string | null;
  incidentOutcome: string | null;
}

export interface AcesInformationType {
  timeDispatched: Dayjs | null;
  timeResponded: Dayjs | null;
  timeEnRoute: Dayjs | null;
  timeArrived: Dayjs | null;
  acesScreenshot: CroppedPicture | undefined;
  drawnScreenshot: DrawnOnPicture | undefined;
}

export interface CameraInformationType {
  timeDispatched: Dayjs | null;
  timeResponded: Dayjs | null;
  timeAllIn: Dayjs | null;
  timeMoveOff: Dayjs | null;
  timeArrived: Dayjs | null;
  hasBufferTime: boolean | null;
  bufferingTime: Dayjs | null;
  bufferingLocation: string;
  dispatchPhoto: CroppedPicture | undefined;
  allInPhoto: CroppedPicture | undefined;
  moveOffPhoto: CroppedPicture | undefined;
  arrivedPhoto: CroppedPicture | undefined;
}

// ====== DERIVED TYPES ======

// Value types used across report models
export type ReportValueKeysType =
  | keyof IncidentInformationType
  | keyof GeneralInformationType
  | keyof AcesInformationType
  | keyof CameraInformationType
  | "id";

export type ReportValueTypes =
  | CroppedPicture
  | DrawnOnPicture
  | Dayjs
  | string
  | null
  | number
  | boolean;

// ====== APPLICATION INTERFACES ======

// Edit operations
export interface EditType {
  key: ReportValueKeysType;
  value: ReportValueTypes;
}

// Display interfaces
export interface DisplayReportDataType {
  id: number;
  incidentNumb: string;
  appliance: string;
  sc: string;
  reportType: ReportType;
}

// Update operations
export interface UpdateReportType {
  id: (id: number) => void;
  cameraInformation: (
    key: keyof CameraInformationType,
    value: CameraInformationType[typeof key],
    saveToDB?: boolean
  ) => void;
  acesInformation: (
    key: keyof AcesInformationType,
    value: AcesInformationType[typeof key],
    saveToDB?: boolean
  ) => void;
  generalInformation: (
    key: keyof GeneralInformationType,
    value: GeneralInformationType[typeof key],
    saveToDB?: boolean
  ) => void;
  incidentInformation: (
    key: keyof IncidentInformationType,
    value: IncidentInformationType[typeof key],
    saveToDB?: boolean
  ) => void;
  all: (report: Report) => void;
}

// ====== ERROR TYPES ======

export type ErrorsType = Partial<Record<ReportValueKeysType, string>>;
export type SetErrorsType = React.Dispatch<React.SetStateAction<ErrorsType>>;

export type ReportGenerationStatusType = "complete" | "inProgress" | "error" | "none";
