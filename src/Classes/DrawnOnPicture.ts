import Picture from "./Picture";

class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get coordinate(): [number, number] {
    return [this.x, this.y] as const;
  }

  set coordinate([x, y]: [number, number]) {
    this.x = x;
    this.y = y;
  }
}

class DrawnOnPicture extends Picture {
  start = new Point();
  end = new Point();

  constructor(image: File | Blob, start?: Point, end?: Point) {
    super(image);

    if (start) this.start = start;
    if (end) this.end = end;
  }

  get startCoordinates(): [number, number] {
    return this.start.coordinate;
  }

  set startCoordinates([x, y]: [number, number]) {
    this.start.coordinate = [x, y];
  }

  get endCoordinates(): [number, number] {
    return this.end.coordinate;
  }

  set endCoordinates([x, y]: [number, number]) {
    this.end.coordinate = [x, y];
  }
}

export default DrawnOnPicture;
