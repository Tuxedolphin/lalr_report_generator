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

  constructor(
    image?: File | Blob,
    start?: [number, number],
    end?: [number, number]
  ) {
    super(image);

    if (start) this.start = new Point(start[0], start[1]);
    if (end) this.end = new Point(end[0], end[1]);
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
