import Picture from "./Picture";

class Shape {
  points = [];

  constructor() {
    this.points = [];
  }
}

class DrawnOnPicture extends Picture {
  shape = new Shape();

  constructor(image: File | Blob, shape?: Shape) {
    super(image);
    this.shape = shape ?? new Shape();
  }
}

export default DrawnOnPicture;
