import {
  type IncidentInformationType,
  type GeneralInformationType,
  type AcesInformationType,
  type CameraInformationType,
  ReportKeys,
} from "../types/types";
import {
  addReport,
  updateReport as updateDBReport,
  deleteReport,
} from "../features/db";

class Report {
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
    timeDispatched: null,
    timeResponded: null,
    timeEnRoute: null,
    timeArrived: null,
    acesScreenshot: undefined,
    drawnScreenshot: undefined,
  };

  protected _cameraInformation: CameraInformationType = {
    timeDispatched: null,
    timeResponded: null,
    timeAllIn: null,
    timeMoveOff: null,
    timeArrived: null,
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

  // =========================================
  //                Getters
  // =========================================

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

  // =========================================
  //            Methods - Getters
  // =========================================

  getAcesActivationTime() {
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

  getCameraActivationTime() {
    const timeMoveOff = this.cameraInformation.timeMoveOff;
    const timeDispatched = this.cameraInformation.timeDispatched;

    if (!timeMoveOff || !timeDispatched) {
      throw new Error(
        "Either camera dispatch timing or camera move off timing is not defined."
      );
    }

    return timeMoveOff.diff(timeDispatched) / 100;
  }

  // =========================================
  //            Methods - Setters
  // =========================================

  updateID(value: number) {
    this.id = value;
  }

  updateCameraInformation(
    key: keyof CameraInformationType,
    value: CameraInformationType[typeof key]
  ) {
    this._cameraInformation = {
      ...this.cameraInformation,
      [key]: value,
    };
  }

  updateAcesInformation(
    key: keyof AcesInformationType,
    value: AcesInformationType[typeof key]
  ) {
    this._acesInformation = {
      ...this.acesInformation,
      [key]: value,
    };
  }

  updateGeneralInformation(
    key: keyof GeneralInformationType,
    value: GeneralInformationType[typeof key]
  ) {
    this._generalInformation = {
      ...this.generalInformation,
      [key]: value,
    };
  }

  updateIncidentInformation(
    key: keyof IncidentInformationType,
    value: IncidentInformationType[typeof key]
  ) {
    this._incidentInformation = {
      ...this.incidentInformation,
      [key]: value,
    };
  }

  // =========================================
  //            Methods - Misc
  // =========================================

  copy() {
    return new Report(
      this.id,
      this.incidentInformation,
      this.generalInformation,
      this.acesInformation,
      this.cameraInformation
    );
  }

  // =========================================
  //               DB Methods
  // =========================================

  async addReportDB() {
    try {
      const id = await addReport(this);
      this.id = id;
    } catch (e) {
      console.error(e);
    }
  }

  updateDBReport(key?: ReportKeys) {
    if (this.id < 0) throw new Error("Report with id < 0 was called");

    if (!key) {
      for (const k of [
        "incidentInformation",
        "generalInformation",
        "acesInformation",
        "cameraInformation",
      ] as const)
        updateDBReport(this.id, k, this[k]);

      return;
    }

    updateDBReport(this.id, key, this[key]);
  }

  deleteDBReport() {
    try {
      deleteReport(this.id);
      this.id = -1;
    } catch (e) {
      console.error(e);
    }
  }
}

export default Report;
