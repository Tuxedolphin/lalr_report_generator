import { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import TimingAndPhotoInput from "../TimingAndPhotoInput";
import { useReportContext } from "../../context/contextFunctions";
import { Box, Typography } from "@mui/material";
import Canvas from "../Canvas";
import DrawnOnPicture from "../../classes/DrawnOnPicture";
import {
  clearCanvas,
  getOffset,
  setCanvasStroke,
} from "../../utils/generalFunctions";

/**
 * If the report is acknowledged by the ops center, the form should be a drawing form instead.
 */

interface DrawingFormProps {}

const DrawingForm: FC<DrawingFormProps> = function () {
  const [report, updateReport] = useReportContext();
  const [isDown, setIsDown] = useState(false);

  // BUG: The cropped image is not replaced if the previous aces screenshot is updated

  const reportImage =
    report.acesInformation.drawnScreenshot ??
    new DrawnOnPicture(report.acesInformation.acesScreenshot?.croppedBlob!); // It'll never be null

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const updateImage = function (image: DrawnOnPicture) {
    updateReport("drawnScreenshot", image);
  };

  const beginDraw = function (e: SyntheticEvent) {
    if (!canvasRef.current || !contextRef.current) return;

    contextRef.current.beginPath();
    reportImage.startCoordinates = getOffset(e, canvasRef);
    updateImage(reportImage);

    clearCanvas(contextRef.current, canvasRef.current);
    setIsDown(true);
  };

  const updateDraw = function (e: SyntheticEvent) {
    if (!canvasRef.current || !contextRef.current || !isDown) return;

    clearCanvas(contextRef.current, canvasRef.current);

    const start = reportImage.startCoordinates;
    const end = getOffset(e, canvasRef);

    contextRef.current.strokeRect(
      start[0],
      start[1],
      end[0] - start[0],
      end[1] - start[1]
    );

    reportImage.endCoordinates = end;
    updateImage(reportImage);
  };

  const endDraw = function () {
    setIsDown(false);
    contextRef.current?.closePath();
  };

  // On page load, update and set the image
  useEffect(() => {
    const image = reportImage.image;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d");

    const updateCanvasSize = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
    };

    if (image.complete) {
      updateCanvasSize();
      setCanvasStroke(context, "red", 3);
    } else {
      image.onload = () => {
        updateCanvasSize();
        setCanvasStroke(context, "red", 3);
      };
    }

    contextRef.current = context;
  }, []);

  return (
    <>
      <Typography></Typography>
      <canvas
        ref={canvasRef}
        className="full-width"
        onTouchStart={beginDraw}
        onMouseDown={beginDraw}
        onTouchMove={updateDraw}
        onMouseMove={updateDraw}
        onTouchEnd={endDraw}
        onMouseUp={endDraw}
        style={{
          backgroundImage: `url(${reportImage.image.src})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
    </>
  );
};

/**
 * The form is broken up into two as on mobile, one form would be a bit too long
 */

interface FirstFootageFormProps {
  handleNext: (newMaxSteps?: number, newActiveStep?: number) => void;
}

const FirstFootageForm: FC<FirstFootageFormProps> = function ({ handleNext }) {
  const [report, updateReport] = useReportContext();
  const cameraInformation = report.cameraInformation;
  const isLA = report.incidentInformation.reportType === "LA";

  const handleSubmit = function (event: React.FormEvent) {
    event.preventDefault();
    handleNext();
  };

  const timings = isLA
    ? ([
        { timeDispatched: cameraInformation.timeDispatched ?? null },
        { timeAllIn: cameraInformation.timeAllIn ?? null },
      ] as const)
    : ([
        { timeMoveOff: cameraInformation.timeMoveOff ?? null },
        { timeArrived: cameraInformation.timeArrived ?? null },
      ] as const);

  const timingAndPhotoInputs = timings.map((timing) => (
    <TimingAndPhotoInput timingInput={timing} key={Object.keys(timing)[0]} />
  ));

  return report.incidentInformation.opsCenterAcknowledged ? (
    <DrawingForm />
  ) : (
    <form id="firstFootageForm" onSubmit={handleSubmit}>
      {timingAndPhotoInputs}
    </form>
  );
};

export default FirstFootageForm;
