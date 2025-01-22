import { Dayjs } from "dayjs";
import { Report, ReportImage } from "../classes/Report";

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
}

export interface GeneralInformationType {
  opsCenterAcknowledged: boolean | null;
  boundary: string | null;
  justification: string | null;
  weather: string | null;
  incidentOutcome: string | null;
}

export interface AcesInformationType {
  timeDispatched: Dayjs | undefined;
  timeResponded: Dayjs | undefined;
  timeEnRoute: Dayjs | undefined;
  timeArrived: Dayjs | undefined;
  acesScreenshot: ReportImage | undefined;
}

export interface CameraInformationType {
  timeDispatched: Dayjs | null | undefined;
  timeResponded: Dayjs | null | undefined;
  timeAllIn: Dayjs | null | undefined;
  timeMoveOff: Dayjs | null | undefined;
  timeArrived: Dayjs | null | undefined;
  bufferingTime: Dayjs | 0 | null | undefined;
  bufferingLocation: string | undefined;
  dispatchPhoto: ReportImage | undefined;
  allInPhoto: ReportImage | undefined;
  moveOffPhoto: ReportImage | undefined;
  arrivedPhoto: ReportImage | undefined;
}

export type ReportValueKeysType =
  | keyof GeneralInformationType
  | keyof AcesInformationType
  | keyof CameraInformationType
  | "id";

export type ReportValueTypes = ReportImage | Dayjs | string | null | number;

export interface EditType {
  key: ReportValueKeysType;
  value: ReportValueTypes;
}
