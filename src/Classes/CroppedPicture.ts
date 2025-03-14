import { SyntheticEvent } from "react";
import Picture from "./Picture";
import { Crop, centerCrop, makeAspectCrop } from "react-image-crop";

class CroppedPicture extends Picture {
  crop: Crop = {
    unit: "%",
    x: 0,
    y: 0,
    width: 40,
    height: 30,
  }; // Default crop is arbitrary

  protected _croppedBlob: Blob | null = null;

  constructor(image?: File | Blob, crop?: Crop) {
    super(image);

    if (image) this.image.src = URL.createObjectURL(image);
    if (crop) this.crop = crop;
  }

  get croppedBlob(): Blob {
    if (!this._croppedBlob)
      throw new Error(
        "Cropped blob is not available. Call saveCroppedBlob() first."
      );

    return this._croppedBlob;
  }

  /**
   * Get the blob of the cropped image
   * @param crop The Crop object to be used to crop the image. If not provided, the default crop object will be used.
   * @returns A promise that resolves to a Blob of the cropped image
   */
  getNewCroppedBlob = (crop?: Crop): Promise<Blob> => {
    crop = crop ?? this.crop;

    const canvas = new OffscreenCanvas(
      this.image.naturalWidth * (crop.width / 100),
      this.image.naturalHeight * (crop.height / 100)
    );

    const context = canvas.getContext("2d");

    canvas.width = this.image.naturalWidth * (crop.width / 100);
    canvas.height = this.image.naturalHeight * (crop.height / 100);

    const cropX = this.image.naturalWidth * (crop.x / 100);
    const cropY = this.image.naturalHeight * (crop.y / 100);

    context?.translate(-cropX, -cropY);

    context?.drawImage(
      this.image,
      0,
      0,
      this.image.naturalWidth,
      this.image.naturalHeight,
      0,
      0,
      this.image.naturalWidth,
      this.image.naturalHeight
    );

    return canvas.convertToBlob().then((blob) => {
      this._croppedBlob = blob;
      return blob;
    });
  };

  saveCroppedBlob = async (): Promise<void> => {
    this._croppedBlob = await this.getNewCroppedBlob();
  };

  updateAndReturnCrop = (crop: Crop): this => {
    this.crop = crop;
    return this;
  };
}

export default CroppedPicture;
