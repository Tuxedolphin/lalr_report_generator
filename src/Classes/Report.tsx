import { Crop } from "react-image-crop";
import { Dayjs } from "dayjs";

export type reportType = "LA" | "LR" | undefined;

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

export interface incidentInformationType {
  incidentNumb: string;
  location: string;
  station: string;
  appliance: string;
  SC: string;
  turnoutFrom: string;
  typeOfCall: string;
  reportType: reportType;
  opsCenterAcknowledged: boolean;
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

export type ReportValueKeysType =
  | keyof incidentInformationType
  | LAInformationKeyType
  | LRInformationKeyType;
export type ReportValueTypes = ReportImage | Dayjs | string | 0 | null;

export class Report {
  id = -1;
  type: reportType | undefined;
  incidentInformation: incidentInformationType | undefined;
  reportInformation: LAInformationType | LRInformationType | undefined;

  constructor();
  constructor(
    id: number,
    type: reportType,
    incidentInformation: incidentInformationType,
    reportInformation: LAInformationType | LRInformationType
  );

  constructor(
    id?: number,
    type?: reportType,
    incidentInformation?: incidentInformationType,
    reportInformation?: LAInformationType | LRInformationType
  ) {
    if (id) {
      this.id = id;
      this.type = type;
      this.incidentInformation = incidentInformation;

      //TODO: Add type checking to ensure that the input information is correct (either LA or LR)
      this.reportInformation = reportInformation;
    }
  }
}
