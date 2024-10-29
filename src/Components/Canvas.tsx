import { FC, useEffect, useRef } from "react"
import { type Crop } from "react-image-crop";

interface CanvasProps {
    image: HTMLImageElement;
    crop: Crop;
}

const Canvas: FC<CanvasProps> = (props) => {
    
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current!;
        const context = canvas.getContext("2d");
    },[])

    return (
        <canvas ref={ref} />
    )
}

export default Canvas