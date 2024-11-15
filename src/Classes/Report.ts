import { Crop } from "react-image-crop";
import { Dayjs } from "dayjs";
import { DayCalendarSkeletonClasses } from "@mui/x-date-pickers";

export type reportType = "LA" | "LR" | undefined | null;

export class ReportImage {
  image: HTMLImageElement = new Image();
  crop: Crop | undefined;
  blob: Blob | undefined;

  constructor();
  constructor(image: File | Blob, crop: Crop);
  constructor(image?: File | Blob, crop?: Crop) {
    if (image) {
      this.image.src = URL.createObjectURL(image);
      this.crop = crop;
    }
  }

  updateImage(image: File | Blob): void {
    this.image.src = URL.createObjectURL(image);
  }
}

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

export type LAInformationKeyType =
  | keyof LAInformationType["generalInformation"]
  | keyof LAInformationType["acesInformation"]
  | keyof LAInformationType["cameraInformation"];

export interface LAInformationType {
  generalInformation: {
    justification: string;
  };

  acesInformation: {
    timeDispatched?: Dayjs;
    timeResponded?: Dayjs;
    acesScreenshot?: ReportImage;
  };

  cameraInformation: {
    timeDispatched?: Dayjs;
    timeResponded?: Dayjs;
    allInPhoto?: ReportImage;
    moveOffPhoto?: ReportImage;
  };
}

export type LRInformationKeyType =
  | keyof LRInformationType["generalInformation"]
  | keyof LRInformationType["acesInformation"]
  | keyof LRInformationType["cameraInformation"];

export interface LRInformationType {
  generalInformation: {
    boundary?: string;
    justification?: string;
    weather?: string;
  };

  acesInformation: {
    timeDispatched?: Dayjs;
    timeEnRoute?: Dayjs;
    acesScreenshot?: ReportImage;
  };

  cameraInformation: {
    timeMoveOff?: Dayjs;
    timeArrived?: Dayjs;
    bufferingTime?: Dayjs | 0 | null;
    bufferingLocation?: string;
    moveOffPhoto?: ReportImage;
    arrivedPhoto?: ReportImage;
  };
}

export interface generalInformationType {
  boundary?: string;
  justification?: string;
  weather?: string;
  incidentOutcome?: string;
}

export interface acesInformationType {
  timeDispatched?: Dayjs;
  timeResponded?: Dayjs;
  timeEnRoute?: Dayjs;
  timeArrived?: Dayjs;
  acesScreenshot?: ReportImage;
}

export interface cameraInformationType {
  timeDispatched?: Dayjs;
  timeResponded?: Dayjs;
  timeMoveOff?: Dayjs;
  timeArrived?: Dayjs;
  allInPhoto?: ReportImage;
  bufferingTime?: Dayjs | 0 | null;
  bufferingLocation?: string;
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
  | LAInformationKeyType
  | LRInformationKeyType
  | "id"
  | "type";
export type ReportValueTypes = ReportImage | Dayjs | string | null | number;

export class Report {
  id = -1;
  incidentInformation: IncidentInformationType = {
    incidentNumb: "",
    location: "",
    station: "",
    appliance: "",
    SC: "",
    turnoutFrom: "",
    typeOfCall: "",
    reportType: undefined,
    opsCenterAcknowledged: undefined,
  };

  generalInformation: generalInformationType = {};

  acesInformation: acesInformationType = {};

  cameraInformation: cameraInformationType = {};

  constructor();
  constructor(
    id: number,
    incidentInformation: IncidentInformationType,
    reportInformation: LAInformationType | LRInformationType
  );

  constructor(
    id?: number,
    incidentInformation?: IncidentInformationType,
    reportInformation?: LAInformationType | LRInformationType
  ) {
    if (id && reportInformation && incidentInformation) {
      this.id = id;
      this.incidentInformation = incidentInformation;

      //TODO: Add type checking to ensure that the input information is correct (either LA or LR)
      this.generalInformation = reportInformation.generalInformation;
      this.acesInformation = reportInformation.acesInformation;
      this.cameraInformation = reportInformation.cameraInformation;
    }
  }

  static updateNewReport(report: Report, edits: MultipleInputEditsType): Report {
    if (!Array.isArray(edits)) {
      return { ...report, [edits.key]: edits.value }
    }

    const newReport = { ...report };
    for (const edit of edits) {
      newReport[edit.key] = edit.value;
    }

    return newReport;
  }

  static updateSingleEntries(report: Report, edits: EditsType) {
      const newReport = { ...report };

      for (const edit of edits) {
        const { key, value } = edit;
        if (key === "id") {
          newReport[key] = value as number;
        } else if (edit.path) {
          newReport[edit.path][key] = edit.value;
        } else
          throw Error(
            `New edit with key ${key} and value ${value as string} is not correctly formatted.\nIs the path being "undefined" correct?`
          );
      }
  }
}
