class Picture {
  image: HTMLImageElement = new Image();
  blob: Blob = new Blob();

  constructor(image?: File | Blob) {
    if (image) {
      this.image.src = URL.createObjectURL(image);
      this.blob = new Blob([image]);
    }
  }

  updateImage = (image: File | Blob): void => {
    this.image.src = URL.createObjectURL(image);
  };

  isEmpty = (): boolean => {
    return this.blob.size === 0;
  }
}

export default Picture;
