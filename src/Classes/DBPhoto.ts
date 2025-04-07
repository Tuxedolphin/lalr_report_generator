import { Crop } from "react-image-crop";
import CroppedPicture from "./CroppedPicture";
import DrawnOnPicture from "./DrawnOnPicture";

class DBPhoto {
  blob: Blob;
  crop?: Crop;
  coordinates?: [[number, number], [number, number]];

  constructor(image: CroppedPicture | DrawnOnPicture) {
    this.blob = image.blob;

    if (image instanceof CroppedPicture) this.crop = image.crop;
    else if (image instanceof DrawnOnPicture)
      this.coordinates = [image.start, image.end];
    else throw new Error("Input image does not match either type");
  }

  private checkForBlob() {
    return this.blob.size !== 0;
  }

  getCroppedPicture() {
    if (!this.crop)
      throw new Error(
        `Cropped picture was retrieved without having a crop. Is ${JSON.stringify(this)} a DrawnOnPicture?`
      );

    if (!this.checkForBlob()) return undefined;

    return new CroppedPicture(this.blob, this.crop);
  }

  getDrawnOnPicture() {
    if (!this.coordinates)
      throw new Error(
        `Drawn-on picture was retrieved without having coordinates. Is ${JSON.stringify(this)} a CroppedPicture?`
      );

    if (!this.checkForBlob()) return undefined;

    return new DrawnOnPicture(
      this.blob,
      this.coordinates[0],
      this.coordinates[1]
    );
  }
}

export default DBPhoto;
