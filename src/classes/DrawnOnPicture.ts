import Picture from "./Picture";

class DrawnOnPicture extends Picture {
  start: [number, number] = [0, 0];
  end: [number, number] = [0, 0];

  constructor(
    image?: File | Blob,
    start?: [number, number],
    end?: [number, number]
  ) {
    super(image);

    if (start) this.start = start;
    if (end) this.end = end;
  }
}

export default DrawnOnPicture;
