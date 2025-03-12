import { FC, useEffect, useRef } from "react";
import ReportImage from "../classes/ReportImage";

interface CanvasProps {
  reportImage: ReportImage;
}

const Canvas: FC<CanvasProps> = ({ reportImage }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const image = reportImage.image;
  const crop = reportImage.crop;

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
  }, [image, crop]);

  return (
    <>
      <canvas ref={ref} style={{ width: "100%" }} />
    </>
  );
};

export default Canvas;
