import { Dayjs } from "dayjs";
import { ReportImage } from "../classes/Report";

export type reportType = "LA" | "LR" | undefined | null;

export interface IncidentInformationType {
  incidentNumb: string;
  location: string;
  station: string;
  appliance: string;
  SC: string;
  turnoutFrom: string;
  typeOfCall: string;
  reportType: reportType;
  opsCenterAcknowledged: boolean | undefined | null;
}

export interface GeneralInformationType {
  boundary?: string;
  justification?: string;
  weather?: string;
  incidentOutcome?: string;
}

export interface AcesInformationType {
  timeDispatched?: Dayjs;
  timeResponded?: Dayjs;
  timeEnRoute?: Dayjs;
  timeArrived?: Dayjs;
  acesScreenshot?: ReportImage;
}

export interface CameraInformationType {
  timeDispatched?: Dayjs | null;
  timeResponded?: Dayjs | null;
  timeAllIn?: Dayjs | null;
  timeMoveOff?: Dayjs | null;
  timeArrived?: Dayjs | null;
  bufferingTime?: Dayjs | 0 | null;
  bufferingLocation?: string;
  dispatchPhoto?: ReportImage;
  allInPhoto?: ReportImage;
  moveOffPhoto?: ReportImage;
  arrivedPhoto?: ReportImage;
}

export type EditsType = {
  key: ReportValueKeysType;
  value: ReportValueTypes;
  path?:
    | "incidentInformation"
    | "generalInformation"
    | "acesInformation"
    | "cameraInformation";
}[];

export type MultipleInputEditsType =
  | { key: keyof Report; value: Report[keyof Report] }
  | { key: keyof Report; value: Report[keyof Report] }[];

export type ReportValueKeysType =
  | keyof IncidentInformationType
  | keyof GeneralInformationType
  | keyof AcesInformationType
  | keyof CameraInformationType
  | "id"
  | "type";
  
export type ReportValueTypes = ReportImage | Dayjs | string | null | number;
