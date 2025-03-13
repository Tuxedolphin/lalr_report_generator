class Picture {
  image: HTMLImageElement = new Image();

  constructor(image?: File | Blob) {
    if (image) this.image.src = URL.createObjectURL(image);
  }

  /**
   * Get the blob of the image without the crop applied
   * @returns A promise that resolves to a Blob of the image
   */
  getBlob = async (): Promise<Blob> => {
    return fetch(this.image.src).then((response) => response.blob());
  };

  updateImage = (image: File | Blob): void => {
    this.image.src = URL.createObjectURL(image);
  };
}

export default Picture;
