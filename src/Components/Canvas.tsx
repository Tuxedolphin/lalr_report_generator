import CroppedPicture from "../classes/CroppedPicture";
import { useRef, useEffect, FC } from "react";

import "../styles/style.css";
import DrawnOnPicture from "../classes/DrawnOnPicture";

interface CanvasProps {
  reportImage: CroppedPicture;
}

const Canvas: FC<CanvasProps> = function ({ reportImage }) {
  const image = reportImage.image;
  const crop = reportImage.crop;

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    canvas.width = image.naturalWidth * (crop.width / 100);
    canvas.height = image.naturalHeight * (crop.height / 100);

    const cropX = image.naturalWidth * (crop.x / 100);
    const cropY = image.naturalHeight * (crop.y / 100);

    context?.translate(-cropX, -cropY);

    context?.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );
  });

  return <canvas ref={ref} className="full-width" />;
};

export default Canvas;
