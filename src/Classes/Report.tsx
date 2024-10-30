export type reportType = "LA" | "LR" | undefined;

export type ReportValueTypes = File | Blob | Crop | string;

export class reportImage {
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

export interface LAInformationType {

}

export interface LRInformationType {}

export class Report {
  
  type: reportType | undefined;
  incidentInformation: incidentInformationType | undefined;
  reportInformation: LAInformationType | LRInformationType | undefined;

  constructor();
  constructor(
    image: File | Blob,
    type: reportType,
    crop: Crop,
    incidentInformation: incidentInformationType,
    reportInformation: LAInformationType | LRInformationType,
  );

  constructor(
    image?: File | Blob,
    type?: reportType,
    crop?: Crop,
    incidentInformation?: incidentInformationType,
    reportInformation?: LAInformationType | LRInformationType,
  ) {
    if (image) {
      this.image.src = URL.createObjectURL(image);
      this.type = type;
      this.crop = crop;
      this.blob = new Blob([image]);
      this.incidentInformation = incidentInformation;
      this.reportInformation = reportInformation;
    }
  }
}
