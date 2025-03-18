import { Dayjs } from "dayjs";
import CroppedPicture from "../classes/CroppedPicture";
import { ReactNode } from "react";
import DrawnOnPicture from "../classes/DrawnOnPicture";

export type reportType = "LA" | "LR" | null;

export interface IncidentInformationType {
  incidentNumb: string;
  location: string;
  station: string;
  appliance: string;
  SC: string;
  turnoutFrom: string;
  typeOfCall: string;
  reportType: reportType;
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

export type ReportKeys =
  | "incidentInformation"
  | "generalInformation"
  | "acesInformation"
  | "cameraInformation";

export interface EditType {
  key: ReportValueKeysType;
  value: ReportValueTypes;
}

export interface ChildrenOnly {
  children: ReactNode;
}

// The key of type Report corresponding to each photo type
export type PhotosType =
  | "acesScreenshot"
  | "dispatchPhoto"
  | "allInPhoto"
  | "moveOffPhoto"
  | "arrivedPhoto";

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
}
