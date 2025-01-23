import { Crop } from "react-image-crop";

import {
  type IncidentInformationType,
  type GeneralInformationType,
  type AcesInformationType,
  type CameraInformationType,
  type ReportValueKeysType,
  type ReportValueTypes,
} from "../types/types";

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

export class Report {
  // TODO: Update all to private and add setters and getters?

  // Setting default values
  id = -1;
  protected incidentInformation: IncidentInformationType = {
    incidentNumb: "",
    location: "",
    station: "",
    appliance: "",
    SC: "",
    turnoutFrom: "",
    typeOfCall: "",
    reportType: null,
  };

  protected generalInformation: GeneralInformationType = {
    opsCenterAcknowledged: null,
    boundary: null,
    justification: null,
    weather: null,
    incidentOutcome: null,
  };

  // Manually setting the values to undefined as it is updated to null for some values manually.
  // Those keys whose values are not undefined will be displayed
  protected acesInformation: AcesInformationType = {
    timeDispatched: undefined,
    timeResponded: undefined,
    timeEnRoute: undefined,
    timeArrived: undefined,
    acesScreenshot: undefined,
  };

  protected cameraInformation: CameraInformationType = {
    timeDispatched: undefined,
    timeResponded: undefined,
    timeAllIn: undefined,
    timeMoveOff: undefined,
    timeArrived: undefined,
    bufferingTime: undefined,
    bufferingLocation: undefined,
    dispatchPhoto: undefined,
    allInPhoto: undefined,
    moveOffPhoto: undefined,
    arrivedPhoto: undefined,
  };

  // There is no id as we do not check for it in the loop
  protected keyToInfoKey = {
    incidentInformation: Object.keys(this.incidentInformation),
    generalInformation: Object.keys(this.generalInformation),
    acesInformation: Object.keys(this.acesInformation),
    cameraInformation: Object.keys(this.cameraInformation),
  } as const;

  constructor();
  constructor(
    id: number,
    incidentInformation: IncidentInformationType,
    generalInformation: GeneralInformationType,
    acesInformation: AcesInformationType,
    cameraInformation: CameraInformationType
  );
  constructor(
    id?: number,
    incidentInformation?: IncidentInformationType,
    generalInformation?: GeneralInformationType,
    acesInformation?: AcesInformationType,
    cameraInformation?: CameraInformationType
  ) {
    if (
      !id ||
      !incidentInformation ||
      !generalInformation ||
      !acesInformation ||
      !cameraInformation
    ) {
      console.warn(
        "Default constructor was called. Is this the correct behaviour?"
      );
      return;
    }

    this.id = id;
    this.incidentInformation = incidentInformation;
    this.generalInformation = generalInformation;
    this.acesInformation = acesInformation;
    this.cameraInformation = cameraInformation;
  }

  /**
   * Updates the value of the key in the current report class
   * @param key The key of the value to be changed
   * @param value The new value to be updated to
   */
  updateReport(key: ReportValueKeysType, value: ReportValueTypes) {

    if (key == "id") {
      this.id = value as number;
      return;
    }

    for (const [infoType, objKeyArray] of Object.entries(this.keyToInfoKey)) {
      for (const objKey of objKeyArray) {
        if (objKey == key) {
          this[infoType][key] = value;
          return;
        }
      }
    }

    console.error(`Report was not updated. Key ${key} was not found.`);
  }
  /**
   * Returns a new report class with the updated value
   * @param key The key of the value to be changed
   * @param value The new value to be updated to
   */
  static updateReport(
    report: Report,
    key: ReportValueKeysType,
    value: ReportValueTypes
  ) {
    const updatedReport = Object.create(report) as Report;
    updatedReport.updateReport(key, value);
    return updatedReport;
  }
}
