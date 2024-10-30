import { FC, useEffect, useRef } from "react";
import { type Crop } from "react-image-crop";

interface CanvasProps {
  image: HTMLImageElement;
  crop: Crop;
}

const Canvas: FC<CanvasProps> = (props) => {
  const { image, crop } = props;

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    const canvas = ref.current!;
    const context = canvas.getContext("2d")!;

    canvas.width = image.naturalWidth * (crop.height / 100);
    canvas.height = image.naturalHeight * (crop.height / 100);

    const cropX = image.naturalWidth * (crop.x / 100);
    const cropY = image.naturalHeight * (crop.y / 100);

    context.translate(-cropX, -cropY);

    context.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    );

  }, [image, crop]);

  return (
    <>
      <canvas ref={ref} style={{width: "100%"}}/>
    </>
  );
};

export default Canvas;
