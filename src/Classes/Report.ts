import { Crop } from "react-image-crop";
import { Dayjs } from "dayjs";

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

  generalInformation: GeneralInformationType;
  acesInformation: AcesInformationType;
  cameraInformation: CameraInformationType;

  constructor();
  constructor(
    id: number,
    incidentInformation: IncidentInformationType,
    generalInformation?: GeneralInformationType,
    acesInformation?: AcesInformationType,
    cameraInformation?: CameraInformationType
  );
  constructor(
    id?: number,
    incidentInformation?: IncidentInformationType,
    generalInformation?: GeneralInformationType,
    acesInformation?: AcesInformationType,
    cameraInformation?: CameraInformationType
  ) {
    if (id && incidentInformation) {
      this.id = id;
      this.incidentInformation = incidentInformation;
    }

    this.generalInformation = generalInformation ? generalInformation : {};
    this.acesInformation = acesInformation ? acesInformation : {};
    this.cameraInformation = cameraInformation ? cameraInformation : {};
  }

  static updateNewReport(
    report: Report,
    edits: MultipleInputEditsType
  ): Report {
    if (!Array.isArray(edits)) {
      return { ...report, [edits.key]: edits.value };
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
