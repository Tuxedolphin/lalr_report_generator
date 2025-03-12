import { Crop } from "react-image-crop";

class ReportImage {
  image: HTMLImageElement = new Image();
  crop: Crop = {
    unit: "%",
    x: 0,
    y: 0,
    width: 80,
    height: 60,
  };

  constructor(image?: File | Blob, crop?: Crop) {
    if (image) this.image.src = URL.createObjectURL(image);
    this.crop = crop ?? this.crop;
  }

  async get_blob() {
    const canvas = new OffscreenCanvas(this.image.width, this.image.height);
    canvas.getContext("2d")?.drawImage(this.image, 0, 0);

    return await canvas
      .convertToBlob()
      .catch((error: unknown) => {
        console.error(error);
        return new Blob();
      })
      .then((blob) => {
        return blob;
      });
  }

  updateImage = (image: File | Blob): void => {
    this.image.src = URL.createObjectURL(image);
  };
}

export default ReportImage;
