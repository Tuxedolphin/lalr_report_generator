import Picture from "./Picture";
import { Crop, makeAspectCrop } from "react-image-crop";

class CroppedPicture extends Picture {
  protected _crop: Crop = makeAspectCrop(
    {
      unit: "%",
      width: 90,
    },
    3 / 2,
    this.image.naturalWidth,
    this.image.naturalHeight
  );

  protected _croppedBlob: Blob | null = null;

  constructor(image?: File | Blob, crop?: Crop) {
    super(image);

    if (image) this.image.src = URL.createObjectURL(image);
    if (crop) this.crop = crop;
  }

  // Property accessors
  set crop(crop: Crop) {
    this._crop = crop;
    this.saveCroppedBlob().catch(console.error);
  }

  get crop(): Crop {
    return this._crop;
  }

  get croppedBlob(): Blob {
    if (!this._croppedBlob) {
      console.error(
        "Cropped blob is not available. Call saveCroppedBlob() first."
      );
      return new Blob();
    }

    return this._croppedBlob;
  }

  // Main functionality methods
  updateAndReturnCrop = (crop: Crop): this => {
    this.crop = crop;
    return this;
  };

  private saveCroppedBlob = async (): Promise<void> => {
    this._croppedBlob = await this.getNewCroppedBlob();
  };

  private getNewCroppedBlob = async (crop?: Crop): Promise<Blob> => {
    if (!this.image.complete) {
      return new Promise<Blob>((resolve) => {
        this.image.onload = () => {
          this.getNewCroppedBlob(crop)
            .then(resolve)
            .catch((error: unknown) => {
              console.error("Error in getNewCroppedBlob:", error);
              resolve(new Blob()); // Resolve with an empty blob to prevent promise hanging
            });
        };
        return;
      });
    }

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

  // Utility methods
  getBase64 = async (): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(this.croppedBlob);

      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  };
}

export default CroppedPicture;
