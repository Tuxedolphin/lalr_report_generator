import { Crop } from "react-image-crop";

import {
  type IncidentInformationType,
  type GeneralInformationType,
  type AcesInformationType,
  type CameraInformationType,
  type ReportValueKeysType,
  type ReportValueTypes,
} from "../types/types";
import dayjs from "dayjs";

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
  // Setting default values
  id = -1;
  protected _incidentInformation: IncidentInformationType = {
    incidentNumb: "",
    location: "",
    station: "",
    appliance: "",
    SC: "",
    turnoutFrom: "",
    typeOfCall: "",
    reportType: null,
    opsCenterAcknowledged: null,
  };

  protected _generalInformation: GeneralInformationType = {
    boundary: null,
    justification: null,
    weather: null,
    incidentOutcome: null,
  };

  // Manually setting the values to undefined as it is updated to null for some values manually.
  // Those keys whose values are not undefined will be displayed
  protected _acesInformation: AcesInformationType = {
    timeDispatched: undefined,
    timeResponded: undefined,
    timeEnRoute: undefined,
    timeArrived: undefined,
    acesScreenshot: undefined,
  };

  protected _cameraInformation: CameraInformationType = {
    timeDispatched: undefined,
    timeResponded: undefined,
    timeAllIn: undefined,
    timeMoveOff: undefined,
    timeArrived: undefined,
    hasBufferTime: null,
    bufferingTime: null,
    bufferingLocation: "",
    dispatchPhoto: undefined,
    allInPhoto: undefined,
    moveOffPhoto: undefined,
    arrivedPhoto: undefined,
  };

  // There is no id as we do not check for it in the loop
  protected _keyToInfoKey = {
    incidentInformation: Object.keys(this._incidentInformation),
    generalInformation: Object.keys(this._generalInformation),
    acesInformation: Object.keys(this._acesInformation),
    cameraInformation: Object.keys(this._cameraInformation),
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
      return;
    }

    this.id = id;
    this._incidentInformation = incidentInformation;
    this._generalInformation = generalInformation;
    this._acesInformation = acesInformation;
    this._cameraInformation = cameraInformation;
  }

  /**
   * Getters
   */

  get incidentInformation() {
    return this._incidentInformation;
  }

  get generalInformation() {
    return this._generalInformation;
  }

  get acesInformation() {
    return this._acesInformation;
  }

  get cameraInformation() {
    return this._cameraInformation;
  }

  get acesActivationTime() {
    const respondTime =
      this.incidentInformation.reportType == "LA"
        ? this.acesInformation.timeResponded
        : this.acesInformation.timeEnRoute;

    const timeDispatched = this.acesInformation.timeDispatched;

    if (!timeDispatched || !respondTime) {
      throw new Error(
        "Either aces dispatch timing or aces respond timing is not defined"
      );
    }

    return respondTime.diff(timeDispatched) / 100;
  }

  get cameraActivationTime() {
    const timeMoveOff = this.cameraInformation.timeMoveOff;
    const timeDispatched = this.cameraInformation.timeDispatched;

    if (!timeMoveOff || !timeDispatched) {
      throw new Error(
        "Either camera dispatch timing or camera move off timing is not defined."
      );
    }

    return timeMoveOff.diff(timeDispatched) / 100;
  }

  /**
   * A getter function to get the value of a specific key, no matter where it is grouped in
   * @param key The key of the value to be obtained
   * @returns The required value
   */
  getValue(key: ReportValueKeysType): ReportValueTypes {
    if (key === "id") return this.id;

    for (const [infoType, objKeyArray] of Object.entries(this._keyToInfoKey)) {
      for (const objKey of objKeyArray) {
        if (objKey === key) {
          return this[infoType][key]; // Same as below, I can't be bothered :D
        }
      }
    }

    throw new Error(`Key ${key} as not found in Object Report.`);
  }

  /**
   * Updates the value of the key in the current report class
   * @param key The key of the value to be changed
   * @param value The new value to be updated to
   */
  updateReport(key: ReportValueKeysType, value: ReportValueTypes) {
    if (key === "id") {
      this.id = value as number;
      return;
    }

    for (const [infoType, objKeyArray] of Object.entries(this._keyToInfoKey)) {
      for (const objKey of objKeyArray) {
        if (objKey === key) {
          this[infoType][key] = value; // I can't be bothered to fix this type error
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
