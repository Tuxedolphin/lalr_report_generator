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

/**
 * Report class that encapsulates all information related to an incident report.
 */
class Report {
  // =========================================
  //               Properties
  // =========================================

  id = -1;

  protected _incidentInformation: IncidentInformationType = {
    incidentNumb: "",
    location: "",
    station: "",
    appliance: "",
    SC: "",
    PO: "",
    turnoutFrom: "",
    typeOfCall: "",
    reportType: null,
    opsCenterAcknowledged: null,
  };

  protected _generalInformation: GeneralInformationType = {
    boundary: "",
    justification: "",
    sftl: {selected: false, remarks: ""},
    trafficCongestion: {selected: false, remarks: ""},
    inclementWeather: {selected: false, remarks: ""},
    acesRouteDeviation: {selected: false, remarks: ""},
  };

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

  readonly keyToInfoKey = {
    incidentInformation: Object.keys(
      this._incidentInformation
    ) as (keyof IncidentInformationType)[],
    generalInformation: Object.keys(
      this._generalInformation
    ) as (keyof GeneralInformationType)[],
    acesInformation: Object.keys(
      this._acesInformation
    ) as (keyof AcesInformationType)[],
    cameraInformation: Object.keys(
      this._cameraInformation
    ) as (keyof CameraInformationType)[],
  } as const;

  // =========================================
  //               Constructor
  // =========================================

  /**
   * Creates a new empty Report instance.
   */
  constructor();
  /**
   * Creates a new Report instance with the provided data.
   *
   * @param id - The unique identifier for the report
   * @param incidentInformation - The incident details
   * @param generalInformation - General information about the incident
   * @param acesInformation - ACES system timing information
   * @param cameraInformation - Camera system timing information
   */
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

  /**
   * Gets the incident information for this report.
   *
   * @returns The incident information object
   */
  get incidentInformation() {
    return this._incidentInformation;
  }

  /**
   * Gets the general information for this report.
   *
   * @returns The general information object
   */
  get generalInformation() {
    return this._generalInformation;
  }

  /**
   * Gets the ACES timing information for this report.
   *
   * @returns The ACES information object
   */
  get acesInformation() {
    return this._acesInformation;
  }

  /**
   * Gets the camera timing information for this report.
   *
   * @returns The camera information object
   */
  get cameraInformation() {
    return this._cameraInformation;
  }

  // =========================================
  //            Update Methods
  // =========================================

  /**
   * Updates the report ID.
   *
   * @param value - The new ID to assign to this report
   */
  updateID(value: number) {
    this.id = value;
  }

  /**
   * Updates a specific field in the camera information.
   *
   * @param key - The field to update
   * @param value - The new value for the field
   */
  updateCameraInformation(
    key: keyof CameraInformationType,
    value: CameraInformationType[typeof key]
  ) {
    this._cameraInformation = {
      ...this.cameraInformation,
      [key]: value,
    };
  }

  /**
   * Updates a specific field in the ACES information.
   *
   * @param key - The field to update
   * @param value - The new value for the field
   */
  updateAcesInformation(
    key: keyof AcesInformationType,
    value: AcesInformationType[typeof key]
  ) {
    this._acesInformation = {
      ...this.acesInformation,
      [key]: value,
    };
  }

  /**
   * Updates a specific field in the general information.
   *
   * @param key - The field to update
   * @param value - The new value for the field
   */
  updateGeneralInformation(
    key: keyof GeneralInformationType,
    value: GeneralInformationType[typeof key]
  ) {
    this._generalInformation = {
      ...this.generalInformation,
      [key]: value,
    };
  }

  /**
   * Updates a specific field in the incident information.
   *
   * @param key - The field to update
   * @param value - The new value for the field
   */
  updateIncidentInformation(
    key: keyof IncidentInformationType,
    value: IncidentInformationType[typeof key]
  ) {
    this._incidentInformation = {
      ...this.incidentInformation,
      [key]: value,
    };
  }

  /**
   * Updates all information from another report instance.
   *
   * @param report - The source report to copy data from
   */
  updateAll(report: Report) {
    this.id = report.id;
    this._cameraInformation = report.cameraInformation;
    this._acesInformation = report.acesInformation;
    this._generalInformation = report.generalInformation;
    this._incidentInformation = report.incidentInformation;
  }

  // =========================================
  //            Database Methods
  // =========================================

  /**
   * Adds this report to the database.
   * Updates the ID of this report with the ID returned from the database.
   *
   * @returns Promise that resolves when the database operation is complete
   */
  async addReportDB() {
    try {
      const id = await addReport(this);
      this.id = id;
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Updates this report in the database.
   * If no key is provided, updates all information sections.
   *
   * @param key - Optional specific section to update
   * @throws Error if the report has an invalid ID (< 0)
   */
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

  /**
   * Deletes this report from the database.
   * Resets the ID to -1 after deletion.
   */
  deleteDBReport() {
    try {
      deleteReport(this.id);
      this.id = -1;
    } catch (e) {
      console.error(e);
    }
  }

  // =========================================
  //              Misc Methods
  // =========================================

  /**
   * Creates a deep copy of this report.
   *
   * @returns A new Report instance with the same data
   */
  copy() {
    return new Report(
      this.id,
      this.incidentInformation,
      this.generalInformation,
      this.acesInformation,
      this.cameraInformation
    );
  }
}

export default Report;
